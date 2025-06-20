import React, { useState, useEffect } from 'react';
import '../css/NewOrderForm.css';

export default function OrderForm({ order, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    customer: '',
    items: '',
    total: '',
    status: 2,
    date: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        customer: order.customer || '',
        items: order.items || '',
        total: order.total || '',
        status: order.status !== undefined ? order.status : 2,
        date: order.date || '',
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="new-order-form-overlay" onClick={onCancel}>
      <div className="new-order-form" onClick={(e) => e.stopPropagation()}>
        <h2>{order ? 'Edit Order' : 'New Order'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Customer:
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Items:
            <input
              type="text"
              name="items"
              value={formData.items}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Total:
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </label>
          <label>
            Status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={2}>Pending</option>
              <option value={1}>Completed</option>
              <option value={0}>Cancelled</option>
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </label>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {order ? 'Update Order' : 'Add Order'}
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
