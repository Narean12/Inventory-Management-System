import React, { useState, useEffect } from 'react';
import '../css/ProductForm.css';

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setStock(product.stock);
      setPrice(product.price);
    } else {
      setName('');
      setCategory('');
      setStock('');
      setPrice('');
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !category || !stock || !price) {
      alert('Please fill in all fields');
      return;
    }
    const productData = {
      id: product ? product.id : null,
      name,
      category,
      stock: Number(stock),
      price,
    };
    onSubmit(productData);
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form-container">
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus/>
          </label>
          <label>Category:
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </label>
          <label>Stock:
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0"/>
          </label>
          <label>Price:
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}/>
          </label>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {product ? 'Update' : 'Add'}
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
