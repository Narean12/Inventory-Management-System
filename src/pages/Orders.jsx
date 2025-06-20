import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { ShoppingCart, Eye, CheckCircle, XCircle, Clock, Edit } from 'lucide-react';
import '../css/Orders.css';
import '../css/NewOrderForm.css';
import OrderForm from '../components/OrderForm';

const statusMap = {
  0: { text: 'Cancelled', icon: <XCircle className="status-icon cancelled" /> },
  1: { text: 'Completed', icon: <CheckCircle className="status-icon completed" /> },
  2: { text: 'Pending', icon: <Clock className="status-icon pending" /> },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.customer.toLowerCase().includes(lowerQuery) ||
            order.items.toLowerCase().includes(lowerQuery) ||
            order._id.toLowerCase().includes(lowerQuery)
        )
      );
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, searchQuery]);

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
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    items: '',
    total: '',
    status: 2, // default to Pending
    date: '',
  });
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewOrderSubmit = async (e) => {
    e.preventDefault();
    // Set current date if not set
    if (!newOrder.date) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      newOrder.date = formattedDate;
    }
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (response.ok) {
        setShowNewOrderForm(false);
        setNewOrder({
          customer: '',
          items: '',
          total: '',
          status: 2,
          date: '',
        });
        fetchOrders();
      } else {
        console.error('Failed to add new order');
      }
    } catch (error) {
      console.error('Error adding new order:', error);
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setIsEditFormVisible(true);
  };

  const handleEditFormSubmit = async (updatedOrder) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${editingOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });
      if (response.ok) {
        setIsEditFormVisible(false);
        setEditingOrder(null);
        fetchOrders();
      } else {
        console.error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleEditFormCancel = () => {
    setIsEditFormVisible(false);
    setEditingOrder(null);
  };

  return (
    <div className="orders-container">
      <Header />

      <div className="orders-content">
        <div className="orders-header">
          <h1 className="orders-title">Orders</h1>
          <button className="new-order-btn" onClick={() => setShowNewOrderForm(true)}>
            <ShoppingCart className="icon" />
            New Order
          </button>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr className="table-header">
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredOrders.map((order) => {
                const status = statusMap[order.status] || { text: 'Unknown', icon: null };
                return (
                  <tr key={order._id}>
                    <td className="order-id">#{order._id}</td>
                    <td className="customer-name">{order.customer}</td>
                    <td className="items">{order.items}</td>
                    <td className="total">{order.total}</td>
                    <td className="status">
                      <div className="status-container">
                        {status.icon}
                        <span>{status.text}</span>
                      </div>
                    </td>
                    <td className="date">{order.date}</td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => handleEditClick(order)} title="Edit Order">
                        <Edit className="icon" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showNewOrderForm && (
        <div className="new-order-form-overlay" onClick={() => setShowNewOrderForm(false)}>
          <div className="new-order-form" onClick={(e) => e.stopPropagation()}>
            <h2>New Order</h2>
            <form onSubmit={handleNewOrderSubmit}>
              <label>
                Customer:
                <input
                  type="text"
                  name="customer"
                  value={newOrder.customer}
                  onChange={handleNewOrderChange}
                  required
                />
              </label>
              <label>
                Items:
                <input
                  type="text"
                  name="items"
                  value={newOrder.items}
                  onChange={handleNewOrderChange}
                  required
                />
              </label>
              <label>
                Total:
                <input
                  type="number"
                  name="total"
                  value={newOrder.total}
                  onChange={handleNewOrderChange}
                  required
                  min="0"
                  step="0.01"
                />
              </label>
              <label>
                Status:
                <select
                  name="status"
                  value={newOrder.status}
                  onChange={handleNewOrderChange}
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
                  value={newOrder.date}
                  onChange={handleNewOrderChange}
                />
              </label>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">Add Order</button>
                <button type="button" className="cancel-btn" onClick={() => setShowNewOrderForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditFormVisible && editingOrder && (
        <OrderForm
          order={editingOrder}
          onSubmit={handleEditFormSubmit}
          onCancel={handleEditFormCancel}
        />
      )}
    </div>
  );
}
