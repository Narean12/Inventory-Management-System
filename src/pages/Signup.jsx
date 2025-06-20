import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import '../css/Signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const success = await signup(formData.username, formData.email, formData.password);
    if (success) {
      alert('Signup successful! Please login.');
      // Optionally redirect to login page
    } else {
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Left Panel - Image */}
        <div className="signup-image-panel">
          <img 
            src="https://www.smartwarehousing.com/hubfs/illustration-of-automatic-logistics-management.png"
            alt="Mountain Landscape"
            className="signup-image"
          />
          <div className="signup-overlay">
            <div className="signup-overlay-text">
              <h2>Inventory Pro</h2>
              <p>Join our platform today</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="signup-form-panel">
          <div>
            <div className="signup-header">
              <h2>Create an account</h2>
              <UserPlus className="signup-icon" />
            </div>
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                />
              </div>
              <button type="submit">Create Account</button>
            </form>
          </div>
          
          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
