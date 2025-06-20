import React, { useState } from 'react';
import Header from '../components/HeaderNotAdmin';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../css/Supplier.css';

export default function Supplier() {
  const [supplyData, setSupplyData] = React.useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          // Map products to { product, quantity } format
          const mappedData = data.map(item => ({
            product: item.name || item.productName || 'Unnamed Product',
            quantity: item.stock || 0,
          }));
          setSupplyData(mappedData);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Monthly Supply Report', 14, 20);

    const tableColumn = ['Product', 'Quantity Supplied'];
    const tableRows = supplyData.map(item => [item.product, item.quantity]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('monthly_supply_report.pdf');
  };

  return (
    <div className="supplier-container">
      <Header />
      <div className="supplier-content">
        <h1>Supplier Dashboard</h1>

        <div className="supply-section">
          <h2>Supply Products</h2>
          <ul>
            {supplyData.map((item, index) => (
              <li key={index}>
                {item.product}: {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="graphs-section">
          <h2>Supply Statistics</h2>
          <p>Graphs will be displayed here.</p>
        </div>

        <button className="download-btn" onClick={generatePDF}>
          Download Monthly Supply Report (PDF)
        </button>
      </div>
    </div>
  );
}
