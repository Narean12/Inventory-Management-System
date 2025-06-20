import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserCircle2 } from 'lucide-react';
import '../css/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const redirectPath = await login(username, password);
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Panel */}
        <div className="login-image">
          <img 
            src="https://cashflowinventory.com/blog/wp-content/uploads/2023/02/inventory-management-system.webp"
            alt="Mountain Landscape"
            className="image"
          />
          <div className="image-overlay">
            <div className="image-text">
              <h2>Inventory Pro</h2>
              <p>Manage your stock efficiently</p>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div>
            <div className="login-header">
              <h2>Welcome back</h2>
              <UserCircle2 className="login-icon" />
            </div>

            {error && (
              <div className="login-error">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit">Sign In</button>
            </form>
          </div>

          <div className="login-footer">
            <p>
              Don’t have an account?{' '}
              <Link to="/signup" className="signup-link">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
