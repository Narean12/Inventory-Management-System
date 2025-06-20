import React, { useState, useEffect } from 'react';
import Header from '../components/HeaderNotAdmin';
import '../css/ProductsNonAdmin.css';
import { useAuth } from '../context/AuthContext';

export default function ProductsNonAdmin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [supplyProductId, setSupplyProductId] = useState(null);
  const [supplyAmount, setSupplyAmount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openSupplyForm = (productId) => {
    setSupplyProductId(productId);
    setSupplyAmount(0);
  };

  const closeSupplyForm = () => {
    setSupplyProductId(null);
    setSupplyAmount(0);
  };

  const handleSupplyChange = (e) => {
    setSupplyAmount(Number(e.target.value));
  };

  const handleSupplySubmit = async () => {
    if (supplyAmount > 0) {
      const product = products.find(p => p._id === supplyProductId);
      if (!product) {
        alert('Product not found');
        return;
      }
      const updatedStock = product.stock + supplyAmount;
      try {
        const res = await fetch(`http://localhost:5000/api/products/${supplyProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: updatedStock }),
        });
        if (res.ok) {
          setProducts(prevProducts =>
            prevProducts.map(p =>
              p._id === supplyProductId ? { ...p, stock: updatedStock } : p
            )
          );
          alert('Product stock updated successfully.');
        } else {
          alert('Failed to update product stock.');
        }
      } catch (error) {
        console.error('Error updating product stock:', error);
        alert('Error updating product stock.');
      }
    }
    closeSupplyForm();
  };

  return (
    <div className="products-container">
      <Header />
      <div className="products-content">
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="products-list">
          <table className="products-table">
            <thead className="table-header">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td className="product-name">{product.name}</td>
                  <td className="product-category">{product.category}</td>
                  <td className="product-stock">{product.stock}</td>
                  <td className="product-price">{product.price}</td>
                  <td>
                    <button className="supply-button" onClick={() => openSupplyForm(product._id)}>Supply</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {supplyProductId && (
        <div className="supply-form-overlay" onClick={closeSupplyForm}>
          <div className="supply-form" onClick={e => e.stopPropagation()}>
            <h3>Increase Product Stock</h3>
            <input
              type="number"
              min="1"
              value={supplyAmount}
              onChange={handleSupplyChange}
              className="supply-input"
              placeholder="Enter amount"
            />
            <div className="supply-form-buttons">
              <button className="supply-submit-button" onClick={handleSupplySubmit}>Submit</button>
              <button className="supply-cancel-button" onClick={closeSupplyForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
