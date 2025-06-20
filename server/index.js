import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

let db, usersCollection, productsCollection, supplyRequestsCollection, ordersCollection;

const handleError = (res, error, message = 'Internal server error') => {
  console.error(message + ':', error);
  res.status(500).json({ message: `${message}: ${error.message}` });
};

async function createAdminUser() {
  const adminEmail = 'admin@iv.pro';
  const adminPassword = 'admin';

  const existingAdmin = await usersCollection.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await usersCollection.insertOne({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

async function startServer() {
  try {
    await client.connect();
    db = client.db('login');
    usersCollection = db.collection('users');
    productsCollection = db.collection('products');
    supplyRequestsCollection = db.collection('supplyRequests');
    ordersCollection = db.collection('orders');

    await createAdminUser();

    app.post('/signup', async (req, res) => {
      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, email, password: hashedPassword, role: 'user' });

        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        handleError(res, error);
      }
    });

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

        const user = await usersCollection.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const redirectPath = user.role === 'admin' ? '/admin' : '/supplier';
        res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email, role: user.role }, redirectPath });
      } catch (error) {
        handleError(res, error);
      }
    });

    app.get('/api/products', async (req, res) => {
      try {
        const query = req.query.supplierId ? { supplierId: req.query.supplierId } : {};
        const products = await productsCollection.find(query).toArray();
        res.status(200).json(products);
      } catch (error) {
        handleError(res, error, 'Error fetching products');
      }
    });

    app.post('/api/products', async (req, res) => {
      try {
        await productsCollection.insertOne(req.body);
        res.status(201).json({ message: 'Product added successfully' });
      } catch (error) {
        handleError(res, error, 'Error adding product');
      }
    });

    app.put('/api/products/:id', async (req, res) => {
      try {
        await productsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        res.status(200).json({ message: 'Product updated successfully' });
      } catch (error) {
        handleError(res, error, 'Error updating product');
      }
    });

    app.delete('/api/products/:id', async (req, res) => {
      try {
        await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        handleError(res, error, 'Error deleting product');
      }
    });

    app.get('/api/orders', async (_, res) => {
      try {
        const orders = await ordersCollection.find({}).toArray();
        res.status(200).json(orders);
      } catch (error) {
        handleError(res, error, 'Error fetching orders');
      }
    });

    app.post('/api/orders', async (req, res) => {
      try {
        await ordersCollection.insertOne(req.body);
        res.status(201).json({ message: 'Order added successfully' });
      } catch (error) {
        handleError(res, error, 'Error adding order');
      }
    });

    app.put('/api/orders/:id', async (req, res) => {
      try {
        await ordersCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        res.status(200).json({ message: 'Order updated successfully' });
      } catch (error) {
        handleError(res, error, 'Error updating order');
      }
    });

    app.delete('/api/orders/:id', async (req, res) => {
      try {
        await ordersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (error) {
        handleError(res, error, 'Error deleting order');
      }
    });

    app.get('/api/users', async (req, res) => {
      try {
        const query = req.query.search ? { $or: [ { username: new RegExp(req.query.search, 'i') }, { email: new RegExp(req.query.search, 'i') } ] } : {};
        const users = await usersCollection.find(query).toArray();
        res.status(200).json(users);
      } catch (error) {
        handleError(res, error, 'Error fetching users');
      }
    });

    app.put('/api/users/:id', async (req, res) => {
      try {
        await usersCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        res.status(200).json({ message: 'User updated successfully' });
      } catch (error) {
        handleError(res, error, 'Error updating user');
      }
    });

    app.delete('/api/users/:id', async (req, res) => {
      try {
        await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        handleError(res, error, 'Error deleting user');
      }
    });

    app.post('/api/admin/verify-password', async (req, res) => {
      try {
        const { password } = req.body;
        const adminUser = await usersCollection.findOne({ role: 'admin' });
        if (!adminUser) return res.status(404).json({ message: 'Admin user not found' });

        const isMatch = await bcrypt.compare(password, adminUser.password);
        res.status(isMatch ? 200 : 401).json({ message: isMatch ? 'Password verified' : 'Invalid password' });
      } catch (error) {
        handleError(res, error, 'Error verifying admin password');
      }
    });

    app.get('/api/revenue', async (_, res) => {
      try {
        const revenueData = await db.collection('revenue').find({}).toArray();
        res.status(200).json(revenueData);
      } catch (error) {
        handleError(res, error, 'Error fetching revenue data');
      }
    });

    app.get('/api/sales_per_month', async (_, res) => {
      try {
        const salesData = await db.collection('sales_per_month').find({}).toArray();
        res.status(200).json(salesData);
      } catch (error) {
        handleError(res, error, 'Error fetching sales data');
      }
    });

    app.get('/api/products/total-items', async (_, res) => {
      try {
        const [result] = await productsCollection.aggregate([{ $group: { _id: null, totalItems: { $sum: '$stock' } } }]).toArray();
        res.status(200).json({ totalItems: result?.totalItems || 0 });
      } catch (error) {
        handleError(res, error, 'Error fetching total items');
      }
    });

    app.get('/api/products/stock-distribution', async (_, res) => {
      try {
        const result = await productsCollection.aggregate([{ $group: { _id: '$category', totalStock: { $sum: '$stock' } } }]).toArray();
        res.status(200).json(result);
      } catch (error) {
        handleError(res, error, 'Error fetching stock distribution');
      }
    });

    app.post('/api/supply-requests', async (req, res) => {
      try {
        const { supplierName, productId, quantity } = req.body;
        if (!supplierName || !productId || !quantity) return res.status(400).json({ message: 'Missing required fields' });

        const supplyRequest = {
          supplierName,
          productId: new ObjectId(productId),
          quantity,
          status: 'pending',
          createdAt: new Date(),
        };
        await supplyRequestsCollection.insertOne(supplyRequest);
        res.status(201).json({ message: 'Supply request created successfully' });
      } catch (error) {
        handleError(res, error, 'Error creating supply request');
      }
    });

    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

startServer();