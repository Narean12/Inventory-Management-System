import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Package, Edit, Trash2 } from 'lucide-react';
import '../css/Products.css'; 
import ProductForm from '../components/ProductForm';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  useEffect(() => {
    const handleSearchChange = () => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('search') || '';
      setSearchQuery(query);
    };
    window.addEventListener('searchChanged', handleSearchChange);
    return () => {
      window.removeEventListener('searchChanged', handleSearchChange);
    };
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

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleDeleteClick = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFormSubmit = async (product) => {
    if (editingProduct) {
      // Update product
      try {
        const response = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        if (response.ok) {
          const updatedProducts = products.map((p) =>
            p._id === editingProduct._id ? { ...product, _id: editingProduct._id } : p
          );
          setProducts(updatedProducts);
        } else {
          console.error('Failed to update product');
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      // Add new product
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        if (response.ok) {
          // Since backend does not return the inserted product, refetch products
          fetchProducts();
        } else {
          console.error('Failed to add product');
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
    setIsFormVisible(false);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="products-container">
      <Header />

      <div className="products-content">
        <div className="products-header">
          <h1 className="products-title">Products</h1>
          <button className="add-product-btn" onClick={handleAddClick}>
            <Package className="icon" />
            Add Product
          </button>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr className="table-header">
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="product-name">{product.name}</td>
                  <td className="product-category">{product.category}</td>
                  <td className="product-stock">{product.stock}</td>
                  <td className="product-price">{product.price}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(product)}
                    >
                      <Edit className="icon" />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      <Trash2 className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormVisible && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}
