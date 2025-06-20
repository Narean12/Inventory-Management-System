import React from 'react';
import LandingHeader from '../components/LandingHeader';
import { Users, Package, ShoppingCart, BarChart2, CheckCircle, Clock, Smile } from 'lucide-react';
import '../css/LandingPage.css';

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main className="landing-main">
        <section className="landing-intro">
          <h1>Welcome to Inventory Pro</h1>
          <p>
            Inventory Pro is your comprehensive stock management solution. 
            Manage your products, orders, and inventory efficiently with our user-friendly platform.
          </p>
          <p>
            Sign up to get started or log in if you already have an account.
          </p>
          <div className="landing-images">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
              alt="Warehouse interior"
              className="landing-image"
            />
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
              alt="Inventory boxes"
              className="landing-image"
            />
          </div>
        </section>

        <section className="landing-features">
          <h2>Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <Package className="feature-icon" />
              <h3>Product Management</h3>
              <p>Organize and track your products with ease.</p>
            </div>
            <div className="feature-card">
              <ShoppingCart className="feature-icon" />
              <h3>Order Processing</h3>
              <p>Manage orders efficiently from start to finish.</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>User Management</h3>
              <p>Control user access and roles securely.</p>
            </div>
            <div className="feature-card">
              <BarChart2 className="feature-icon" />
              <h3>Analytics</h3>
              <p>Gain insights with detailed reports and charts.</p>
            </div>
          </div>
        </section>

        <section className="landing-why-choose">
          <h2>Why Choose Inventory Pro?</h2>
          <div className="why-cards">
            <div className="why-card">
              <CheckCircle className="why-icon" />
              <h3>Reliable</h3>
              <p>Trusted by thousands of businesses worldwide.</p>
            </div>
            <div className="why-card">
              <Clock className="why-icon" />
              <h3>Real-Time</h3>
              <p>Instant updates to keep your inventory accurate.</p>
            </div>
            <div className="why-card">
              <Smile className="why-icon" />
              <h3>User Friendly</h3>
              <p>Easy to use interface designed for efficiency.</p>
            </div>
          </div>
        </section>

        <section className="landing-how-it-works">
          <h2>How It Works</h2>
          <ol className="how-list">
            <li>Sign up and create your account.</li>
            <li>Add your products and inventory details.</li>
            <li>Track orders and manage stock in real-time.</li>
            <li>Analyze reports and optimize your business.</li>
          </ol>
        </section>

        <section className="landing-testimonials">
          <h2>What Our Customers Say</h2>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <p>"Inventory Pro transformed how we manage our stock. Highly recommended!"</p>
              <span>- Sarah K.</span>
            </div>
            <div className="testimonial-card">
              <p>"The analytics feature helped us increase our sales by 20% in 3 months."</p>
              <span>- Mike D.</span>
            </div>
            <div className="testimonial-card">
              <p>"User-friendly and reliable. Our team loves it."</p>
              <span>- Linda P.</span>
            </div>
          </div>
        </section>

        <section className="landing-get-started">
          <h2>Get Started Today</h2>
          <p>Join Inventory Pro and take control of your inventory management.</p>
          <button className="get-started-button" onClick={() => window.location.href = '/signup'}>
            Sign Up Now
          </button>
        </section>
      </main>
    </>
  );
}
