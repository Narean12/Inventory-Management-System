import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import '../css/LandingHeader.css';

export default function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-header-container">
        <div className="landing-logo">
          <Package className="landing-logo-icon" />
          <span className="landing-logo-text">Inventory Pro</span>
        </div>
        <div className="landing-header-buttons">
          <Link to="/login" className="landing-header-button">
            Login
          </Link>
          <Link to="/signup" className="landing-header-button signup-button">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
