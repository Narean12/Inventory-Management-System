import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Bell, Settings, Search, Menu } from 'lucide-react';
import '../css/Header.css'; 

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Left side */}
          <div className="header-left">
            <div className="header-logo">
              <Package className="header-icon" />
              <span className="header-title">Inventory Pro</span>
            </div>
            <div className="nav-links">
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/admin/products" className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}>
                Products
              </Link>
              <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}>
                Orders
              </Link>
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                User Management
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="header-right">
            <div className="search-wrapper">
              <div className="search-icon">
                <Search className="icon-small" />
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                      const currentPath = window.location.pathname;
                      // Navigate to current path with search query param
                      window.history.pushState(null, '', `${currentPath}?search=${encodeURIComponent(query)}`);
                      // Dispatch a custom event to notify pages of search change
                      window.dispatchEvent(new Event('searchChanged'));
                    }
                  }
                }}
              />
            </div>
            <button className="icon-button">
              <Bell className="icon" />
            </button>
            <button className="icon-button" onClick={() => navigate('/profile')}>
              <Settings className="icon" />
            </button>
            <div className="divider"></div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <button className="icon-button mobile-only">
              <Menu className="icon" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
