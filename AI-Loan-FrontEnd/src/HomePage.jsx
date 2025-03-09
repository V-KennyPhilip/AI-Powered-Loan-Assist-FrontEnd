import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import l24logo from './assets/Loans24Logo.png';
import Chatbot from './ChatBot';

const FinancialDashboard = () => {
  // State for user and financial data
  const [userName, setUserName] = useState('V Kenny Philip');
  const [loans, setLoans] = useState([]);
  const [bankDetails, setBankDetails] = useState({});
  const [emiDetails, setEmiDetails] = useState([]);
  const [expandedLoanId, setExpandedLoanId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Create a ref for the dropdown container
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data from APIs
  useEffect(() => {
    fetch('http://localhost:8080/api/loans')
      .then(response => response.json())
      .then(data => setLoans(data))
      .catch(error => console.error('Error fetching loans:', error));

    fetch('http://localhost:8080/api/bank')
      .then(response => response.json())
      .then(data => setBankDetails(data))
      .catch(error => console.error('Error fetching bank details:', error));

    fetch('http://localhost:8080/api/emi')
      .then(response => response.json())
      .then(data => setEmiDetails(data))
      .catch(error => console.error('Error fetching EMI details:', error));
  }, []);

  // Listen for clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Toggle loan details expansion
  const toggleLoanDetails = (loanId) => {
    setExpandedLoanId(expandedLoanId === loanId ? null : loanId);
  };

  // Logout handler
  const handleLogout = () => {
    console.log('Logging out');
    navigate('/auth', { state: { message: "Successfully logged out!", type: "success" } });
  };

  const location = useLocation();
  const { message, type } = location.state || {};

  

  return (
    <>
      <div>
        {message && (
          <div className={`toast-message ${type}`}>
            {message}
          </div>
        )}
      </div>
      {/* Header */}
      <header>
        <div className="container header-content">
          <div className="logo">
            <img src={l24logo} alt="Company Logo" className="logo-img" />
            <span>Loans24</span>
          </div>

          <nav className="nav-menu">
            <div className="nav-item">
              <a href="#" className="nav-link">Dashboard</a>
            </div>
            <div className="nav-item">
              <a href="#" className="nav-link">Transactions</a>
            </div>
            <div className="nav-item">
              <a href="#" className="nav-link">Apply for Loan</a>
            </div>
          </nav>

          {/* Attach ref to user-dropdown */}
          <div className="user-dropdown" ref={dropdownRef}>
            <div 
              className="user-profile"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>👤 {userName}</span>
              {/* Add a dynamic class for arrow rotation */}
              <svg
                className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            
            {isDropdownOpen && (
              <div className="dropdown-content">
                <a href="#" className="dropdown-item" onClick={handleLogout}>Logout</a>
                <a href="#" className="dropdown-item">About Us</a>
                <a href="#" className="dropdown-item">Customer Support</a>
                <a href="#" className="dropdown-item">Help Center</a>
                <a href="#" className="dropdown-item">Settings</a>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Welcome Section */}
        <section className="welcome-section container">
          <h1 className="welcome-title">Welcome, {userName}</h1>
          <p className="welcome-subtitle">
            Here's an overview of your financial portfolio
          </p>
        </section>

        {/* Financial Dashboard */}
        <section className="financial-dashboard container">
          {/* Loans Container */}
          <div className="dashboard-container loans-container">
            <h2 className="container-title">Your Loans</h2>
            
            {loans.length === 0 ? (
              <div className="loading-state">Loading your loan information...</div>
            ) : (
              loans.map((loan) => (
                <div key={loan.id} className="financial-card">
                  <div 
                    className="card-header"
                    onClick={() => toggleLoanDetails(loan.id)}
                  >
                    <div className="loan-details">
                      <h3>{loan.loanType}</h3>
                      <div className="detail-row">
                        <span className="detail-label">Loan Amount:</span>
                        <span className="detail-value">${loan.loanAmount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className={`detail-value status-${loan.loanStatus.toLowerCase()}`}>
                          {loan.loanStatus}
                        </span>
                      </div>
                    </div>
                    <div className="card-toggle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                           viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points={expandedLoanId === loan.id ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                      </svg>
                    </div>
                  </div>
                  
                  {/* EMI Details (Expandable) */}
                  {expandedLoanId === loan.id && (
                    <div className="card-expandable">
                      <h4>EMI Details</h4>
                      {emiDetails
                        .filter(emi => emi.loanId === loan.id)
                        .map((emi, index) => (
                          <div key={index} className="emi-card">
                            <div className="detail-row">
                              <span className="detail-label">EMI Amount:</span>
                              <span className="detail-value">${emi.emiAmount}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Status:</span>
                              <span className={`detail-value status-${emi.emiStatus.toLowerCase()}`}>
                                {emi.emiStatus}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Late Fee:</span>
                              <span className="detail-value">${emi.lateFee}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Bank Details Container */}
          <div className="dashboard-container bank-container">
            <h2 className="container-title">Bank Details</h2>
            
            {Object.keys(bankDetails).length === 0 ? (
              <div className="loading-state">Loading your bank information...</div>
            ) : (
              <div className="financial-card">
                <div className="bank-details">
                  <div className="detail-row">
                    <span className="detail-label">Bank Name:</span>
                    <span className="detail-value">{bankDetails.bankName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Account Type:</span>
                    <span className="detail-value">{bankDetails.accountType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Account Number:</span>
                    <span className="detail-value">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">IFSC Code:</span>
                    <span className="detail-value">{bankDetails.ifscCode}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>About Loans24</h3>
              <a href="#" className="footer-link">Our Story</a>
              <a href="#" className="footer-link">Leadership Team</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Press Releases</a>
            </div>
            <div className="footer-column">
              <h3>Products</h3>
              <a href="#" className="footer-link">Personal Loans</a>
              <a href="#" className="footer-link">Home Loans</a>
              <a href="#" className="footer-link">Business Loans</a>
              <a href="#" className="footer-link">Education Loans</a>
            </div>
            <div className="footer-column">
              <h3>Resources</h3>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Guides</a>
              <a href="#" className="footer-link">FAQ</a>
              <a href="#" className="footer-link">Help Center</a>
            </div>
            <div className="footer-column">
              <h3>Legal</h3>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Cookie Policy</a>
              <a href="#" className="footer-link">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Loans24. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Chatbot />
      
      <style jsx>{`
        :root {
          /* Adjusted space background with a slightly lighter blue gradient */
          --primary-blue: #1e3a8a;
          --secondary-blue: #2563eb;
          --light-blue: #4299e1;
          --accent-blue: #63b3ed;
          --space-gradient: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
          --background: #1e293b;
          --card-bg: rgba(13, 25, 42, 0.8);
          --text-dark: #2d3748;
          --text-light: #f7fafc;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          background: var(--background) url('/space-bg.jpg') no-repeat fixed center;
          background-size: cover;
          color: var(--text-light);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .toast-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 2rem;
          border-radius: 8px;
          z-index: 1100;
          animation: slideDown 0.5s ease-out;
        }
        .toast-message.success {
          background-color: #d1fae5;
          color: #065f46;
        }
        .toast-message.error {
          background-color: #fee2e2;
          color: #991b1b;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }


        /* Header Styles */
        header {
          background: var(--space-gradient);
          color: var(--text-light);
          padding: 1rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .logo-img {
          height: 40px;
          margin-right: 10px;
        }

        .nav-menu {
          display: flex;
          gap: 1.5rem;
        }

        .nav-item {
          cursor: pointer;
          position: relative;
        }

        .nav-link {
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: var(--accent-blue);
        }

        .user-dropdown {
          position: relative;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.1);
          transition: background 0.3s ease;
        }

        .user-profile:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .dropdown-content {
          position: absolute;
          right: 0;
          top: 100%;
          background: var(--space-gradient);
          min-width: 180px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          margin-top: 0.5rem;
          z-index: 10;
          transition: opacity 0.3s ease;
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--text-light);
          text-decoration: none;
          transition: background 0.3s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Dropdown Arrow Animation */
        .dropdown-arrow {
          transition: transform 0.3s ease;
        }
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        /* Welcome Section */
        .welcome-section {
          padding: 3rem 0 2rem;
          text-align: center;
        }

        .welcome-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, var(--light-blue), #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-subtitle {
          font-size: 1.2rem;
          color: #a0aec0;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Financial Dashboard */
        .financial-dashboard {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem 0;
        }

        @media (max-width: 768px) {
          .financial-dashboard {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-container {
          background: var(--card-bg);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        .container-title {
          padding: 1.5rem;
          font-size: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--light-blue);
        }

        .financial-card {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .financial-card:last-child {
          border-bottom: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .loan-details h3 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: var(--accent-blue);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-label {
          color: #a0aec0;
        }

        .detail-value {
          font-weight: 600;
        }

        .status-active, .status-paid {
          color: #48bb78;
        }

        .status-pending {
          color: #ecc94b;
        }

        .status-overdue, .status-late {
          color: #f56565;
        }

        .card-toggle {
          color: var(--accent-blue);
        }

        .card-expandable {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-expandable h4 {
          margin-bottom: 1rem;
          color: var(--accent-blue);
          font-size: 1rem;
        }

        .emi-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .loading-state {
          padding: 2rem;
          text-align: center;
          color: #a0aec0;
        }

        /* Footer */
        footer {
          background: var(--space-gradient);
          color: var(--text-light);
          padding: 4rem 0 2rem;
          margin-top: 4rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .footer-column h3 {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .footer-column h3::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 50px;
          height: 2px;
          background: var(--accent-blue);
        }

        .footer-link {
          display: block;
          color: #e2e8f0;
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
          text-decoration: none;
        }

        .footer-link:hover {
          color: var(--accent-blue);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: #e2e8f0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
          .nav-menu {
            flex-wrap: wrap;
            justify-content: center;
          }
          .welcome-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default FinancialDashboard;