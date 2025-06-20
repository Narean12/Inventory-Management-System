import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header';
import { BarChart2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../css/SupplierDashboard.css';

export default function SupplierDashboard() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const overviewRef = useRef();

  useEffect(() => {
    if (!user || isAdmin) {
      // Redirect or block access if not supplier
      window.location.href = '/';
      return;
    }
    fetchSupplierProducts();
  }, [user, isAdmin]);

  const fetchSupplierProducts = async () => {
    try {
      // Assuming backend API supports filtering by supplier id
      const response = await fetch(`http://localhost:5000/api/products?supplierId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch supplier products');
      }
    } catch (error) {
      console.error('Error fetching supplier products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = () => {
    // Placeholder for growth calculation logic
    // For example, compare current stock with previous period
    return '10%';
  };

  const downloadPDF = () => {
    const input = overviewRef.current;
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('supplier-overview.pdf');
    });
  };

  if (!user || isAdmin) {
    return <div>Access denied. Only suppliers can view this page.</div>;
  }

  return (
    <>
      <Header />
      <main className="supplier-dashboard-main" ref={overviewRef}>
        <h1>Supplier Dashboard</h1>
        {loading ? (
          <p>Loading your products...</p>
        ) : (
          <>
            <section className="products-overview">
              <h2>Your Products Overview</h2>
              <ul>
                {products.map((product) => (
                  <li key={product._id}>
                    {product.name} - Stock: {product.stock} - Price: {product.price}
                  </li>
                ))}
              </ul>
            </section>
            <section className="products-growth">
              <h2>Growth</h2>
              <p>Stock growth: {calculateGrowth()}</p>
              <BarChart2 size={48} />
            </section>
            <button className="download-pdf-btn" onClick={downloadPDF}>
              <Download /> Download Overview as PDF
            </button>
          </>
        )}
      </main>
    </>
  );
}
