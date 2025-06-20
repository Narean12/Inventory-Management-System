import React, { useEffect, useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../css/AdminDashboard.css';

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [stockData, setStockData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users/count')
      .then((res) => res.json())
      .then((data) => {
        console.log('User count data:', data);
        setTotalUsers(data.userCount ?? 0);
      })
      .catch((err) => console.error('Failed to fetch user count:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/total-items')
      .then((res) => res.json())
      .then((data) => {
        console.log('Total items data:', data);
        setTotalItems(data.totalItems ?? 0);
      })
      .catch((err) => console.error('Failed to fetch total items:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/stock-distribution')
      .then((res) => res.json())
      .then((data) => {
        console.log('Stock distribution data:', data);
        const formattedData = data.map((item) => ({
          name: item._id,
          value: item.totalStock
        }));
        setStockData(formattedData);
      })
      .catch((err) => console.error('Failed to fetch stock distribution:', err));
  }, []);

  // Fetch Monthly Sales Data
  useEffect(() => {
    fetch('http://localhost:5000/api/sales_per_month')
      .then((res) => res.json())
      .then((data) => {
        console.log('Monthly sales data:', data);
        const formattedData = data.map((item) => ({
          month: item.month,
          sales: item.sales
        }));
        setSalesData(formattedData);
      })
      .catch((err) => console.error('Failed to fetch monthly sales:', err));
  }, []);

  // Fetch Monthly Revenue and Profit Data
  useEffect(() => {
    fetch('http://localhost:5000/api/revenue/monthly')
      .then((res) => res.json())
      .then((data) => {
        console.log('Monthly revenue data:', data);
        const formattedData = data.map((item) => ({
          name: item.month,
          revenue: item.revenue,
          profit: item.profit ?? 0
        }));
        setMonthlyRevenue(formattedData);
        console.log('Formatted monthly revenue:', formattedData);
      })
      .catch((err) => console.error('Failed to fetch monthly revenue:', err));
  }, []);

  return (
    <div className="admin-dashboard-container">
      <Header />

      <div className="admin-dashboard-content">
        {/* Stats Cards */}
        <div className="stats-cards-container">
          <div className="stat-card">
            <div className="stat-card-content">
              <Users className="stat-card-icon" />
              <div className="stat-card-text">
                <p className="stat-card-label">Total Items</p>
                <p className="stat-card-value">{totalItems}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <Users className="stat-card-icon" />
              <div className="stat-card-text">
                <p className="stat-card-label">Total Users</p>
                <p className="stat-card-value">{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <Users className="stat-card-icon" />
              <div className="stat-card-text">
                <p className="stat-card-label">Revenue</p>
                <p className="stat-card-value">₹{monthlyRevenue.reduce((acc, item) => acc + item.revenue, 0)}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-content">
              <TrendingUp className="stat-card-icon" />
              <div className="stat-card-text">
                <p className="stat-card-label">Growth</p>
                <p className="stat-card-value">+23%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-container">
          <div className="chart-card">
            <h3 className="chart-title">Monthly Sales</h3>
        <div className="chart-container" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#fff" tickFormatter={(month) => month.substring(0, 3)} interval={0} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#fff" tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
              <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} isAnimationActive={true} animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Revenue vs Profit</h3>
        <div className="chart-container" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {monthlyRevenue && monthlyRevenue.length > 0 ? (
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" />
              </LineChart>
            ) : (
              <p style={{ color: '#fff', textAlign: 'center' }}>Loading chart data...</p>
            )}
          </ResponsiveContainer>
        </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Stock Distribution</h3>
        <div className="chart-container" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8b5cf6"
                dataKey="value"
                label
              />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Monthly Performance</h3>
        <div className="chart-container" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
              <Bar dataKey="sales" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
