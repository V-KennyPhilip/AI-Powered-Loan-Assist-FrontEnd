import React, { useEffect } from 'react';
import l24logo from './assets/Loans24Logo.png';
import { Link } from 'react-router-dom';
import ChatbotButton from './components/ChatbotButton';



const LandingPage = () => {
  useEffect(() => {
    const carousel = document.getElementById('loanCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cardWidth = 320; // card width + margin

    if (prevBtn && nextBtn && carousel) {
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({
          left: -cardWidth,
          behavior: 'smooth'
        });
      });

      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({
          left: cardWidth,
          behavior: 'smooth'
        });
      });
    }

    const cardImages = document.querySelectorAll('.card-image-container');
    cardImages.forEach(image => {
      image.addEventListener('click', () => {
        alert('Loan details page would open here');
      });
    });

    // Cleanup listeners on unmount if necessary.
    return () => {
      // Remove event listeners if required
    };
  }, []);

  return (
    <>
      <header>
        <div className="container header-content">
          <div className="logo">
            <img src={l24logo} alt="Loans24 Logo" className="logo-img" />
            <span>Loans24</span>
          </div>

          <nav className="nav-menu">
            <div className="nav-item">
              <a href="#" className="nav-link">Home</a>
            </div>

            <div className="nav-item dropdown">
              <a href="#" className="nav-link">Products</a>
              <div className="dropdown-content">
                <a href="#" className="dropdown-item">Personal Loans</a>
                <a href="#" className="dropdown-item">Home Loans</a>
                <a href="#" className="dropdown-item">Business Loans</a>
                <a href="#" className="dropdown-item">Education Loans</a>
              </div>
            </div>

            <div className="nav-item dropdown">
              <a href="#" className="nav-link">Resources</a>
              <div className="dropdown-content">
                <a href="#" className="dropdown-item">Loan Calculator</a>
                <a href="#" className="dropdown-item">Guides</a>
                <a href="#" className="dropdown-item">FAQ</a>
              </div>
            </div>

            <div className="nav-item">
              <a href="#" className="nav-link">Contact Us</a>
            </div>
          </nav>

          {/* <div className="auth-buttons">
            <button className="btn btn-outline">Login</button>
            <button className="btn btn-primary">Sign Up</button>
          </div> */}

          <div className="auth-buttons">
            <Link to="/auth" className="btn btn-outline">Login</Link>
            <Link to="/auth" className="btn btn-primary">Sign Up</Link>
          </div>

        </div>
      </header>

      <main>
        <section className="hero-section container">
          <h1 className="hero-title">Find the Perfect Loan for Your Needs</h1>
          <p className="hero-subtitle">
            Loans24 offers a variety of loan options tailored to your financial requirements.
            Explore our options and get instant approval with competitive rates.
          </p>
        </section>

        <section className="card-carousel-container container">
          <div className="card-carousel" id="loanCarousel">
            {/* Personal Loan Card */}
            <div className="loan-card">
              <div className="card-image-container">
                <img src="/api/placeholder/300/180" alt="Personal Loan" className="card-image" />
                <div className="card-image-overlay">
                  <span className="overlay-text">View Details</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Personal Loan</h3>
                <p className="card-description">
                  Quick funds for your personal needs with minimal documentation and flexible repayment options.
                </p>
                <div className="card-detail">
                  <span className="detail-label">Interest Rate</span>
                  <span className="detail-value">8.99% - 14.99%</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Loan Amount</span>
                  <span className="detail-value">$1,000 - $50,000</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">1 - 5 Years</span>
                </div>
              </div>
            </div>

            {/* Home Loan Card */}
            <div className="loan-card">
              <div className="card-image-container">
                <img src="/api/placeholder/300/180" alt="Home Loan" className="card-image" />
                <div className="card-image-overlay">
                  <span className="overlay-text">View Details</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Home Loan</h3>
                <p className="card-description">
                  Make your dream home a reality with our affordable and transparent home loan offerings.
                </p>
                <div className="card-detail">
                  <span className="detail-label">Interest Rate</span>
                  <span className="detail-value">4.50% - 6.75%</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Loan Amount</span>
                  <span className="detail-value">Up to $1,000,000</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">5 - 30 Years</span>
                </div>
              </div>
            </div>

            {/* Business Loan Card */}
            <div className="loan-card">
              <div className="card-image-container">
                <img src="/api/placeholder/300/180" alt="Business Loan" className="card-image" />
                <div className="card-image-overlay">
                  <span className="overlay-text">View Details</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Business Loan</h3>
                <p className="card-description">
                  Fuel your business growth with our hassle-free business financing solutions.
                </p>
                <div className="card-detail">
                  <span className="detail-label">Interest Rate</span>
                  <span className="detail-value">7.50% - 16.00%</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Loan Amount</span>
                  <span className="detail-value">$10,000 - $500,000</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">1 - 7 Years</span>
                </div>
              </div>
            </div>

            {/* Education Loan Card */}
            <div className="loan-card">
              <div className="card-image-container">
                <img src="/api/placeholder/300/180" alt="Education Loan" className="card-image" />
                <div className="card-image-overlay">
                  <span className="overlay-text">View Details</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Education Loan</h3>
                <p className="card-description">
                  Invest in your future with our affordable education loans for higher studies.
                </p>
                <div className="card-detail">
                  <span className="detail-label">Interest Rate</span>
                  <span className="detail-value">5.50% - 8.75%</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Loan Amount</span>
                  <span className="detail-value">$5,000 - $150,000</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">5 - 15 Years</span>
                </div>
              </div>
            </div>

            {/* Auto Loan Card */}
            <div className="loan-card">
              <div className="card-image-container">
                <img src="/api/placeholder/300/180" alt="Auto Loan" className="card-image" />
                <div className="card-image-overlay">
                  <span className="overlay-text">View Details</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Auto Loan</h3>
                <p className="card-description">
                  Drive your dream car today with our competitive auto financing solutions.
                </p>
                <div className="card-detail">
                  <span className="detail-label">Interest Rate</span>
                  <span className="detail-value">3.99% - 7.25%</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Loan Amount</span>
                  <span className="detail-value">$5,000 - $100,000</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">1 - 7 Years</span>
                </div>
              </div>
            </div>

            {/* Debt Consolidation Card */}
            <div className="loan-card">
              <div className="card-image-container">
                <img src="/api/placeholder/300/180" alt="Debt Consolidation" className="card-image" />
                <div className="card-image-overlay">
                  <span className="overlay-text">View Details</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Debt Consolidation</h3>
                <p className="card-description">
                  Simplify your finances by consolidating multiple debts into a single monthly payment.
                </p>
                <div className="card-detail">
                  <span className="detail-label">Interest Rate</span>
                  <span className="detail-value">6.99% - 18.00%</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Loan Amount</span>
                  <span className="detail-value">$5,000 - $100,000</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Tenure</span>
                  <span className="detail-value">1 - 7 Years</span>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button className="carousel-button" id="prevBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="carousel-button" id="nextBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
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
              <a href="#" className="footer-link">Testimonials</a>
            </div>
            <div className="footer-column">
              <h3>Products</h3>
              <a href="#" className="footer-link">Personal Loans</a>
              <a href="#" className="footer-link">Home Loans</a>
              <a href="#" className="footer-link">Business Loans</a>
              <a href="#" className="footer-link">Education Loans</a>
              <a href="#" className="footer-link">Auto Loans</a>
            </div>
            <div className="footer-column">
              <h3>Resources</h3>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Guides</a>
              <a href="#" className="footer-link">FAQ</a>
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Contact Support</a>
            </div>
            <div className="footer-column">
              <h3>Calculators</h3>
              <a href="#" className="footer-link">EMI Calculator</a>
              <a href="#" className="footer-link">Affordability Calculator</a>
              <a href="#" className="footer-link">Interest Rate Comparison</a>
              <a href="#" className="footer-link">Loan Eligibility</a>
              <a href="#" className="footer-link">Refinance Calculator</a>
            </div>
            <div className="footer-column">
              <h3>Legal</h3>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Cookie Policy</a>
              <a href="#" className="footer-link">Security</a>
              <a href="#" className="footer-link">Accessibility</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Loans24. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        :root {
          --primary-blue: #1a365d;
          --secondary-blue: #2a4a7f;
          --light-blue: #4299e1;
          --accent-blue: #63b3ed;
          --background: #f7fafc;
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
          background-color: var(--background);
          color: var(--text-dark);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header Styles */
        header {
          background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
          color: var(--text-light);
          padding: 1rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          background-color: white;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          z-index: 1;
          border-radius: 8px;
          overflow: hidden;
          top: 100%;
          left: 0;
        }

        .dropdown:hover .dropdown-content {
          display: block;
        }

        .dropdown-item {
          color: var(--text-dark);
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          transition: background-color 0.3s ease;
        }

        .dropdown-item:hover {
          background-color: #f1f1f1;
        }

        .auth-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-outline {
          background: transparent;
          color: var(--text-light);
          border: 1px solid var(--text-light);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-primary {
          background-color: var(--accent-blue);
          color: var(--text-light);
        }

        .btn-primary:hover {
          background-color: var(--light-blue);
        }

        /* Main Content */
        .hero-section {
          padding: 3rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, var(--primary-blue), var(--light-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #4a5568;
          max-width: 700px;
          margin: 0 auto 2rem;
        }

        /* Card Carousel */
        .card-carousel-container {
          position: relative;
          padding: 2rem 0;
          overflow: hidden;
        }

        .card-carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 1.5rem 0;
          margin: 0 -20px;
          padding-left: 20px;
          scrollbar-width: none;
        }

        .card-carousel::-webkit-scrollbar {
          display: none;
        }

        .loan-card {
          flex: 0 0 300px;
          margin-right: 20px;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          scroll-snap-align: start;
        }

        .loan-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .card-image-container {
          height: 180px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-image-container:hover .card-image {
          transform: scale(1.05);
        }

        .card-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(26, 54, 93, 0.2), rgba(26, 54, 93, 0.7));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-image-container:hover .card-image-overlay {
          opacity: 1;
        }

        .overlay-text {
          color: white;
          font-weight: bold;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--primary-blue);
        }

        .card-description {
          color: #4a5568;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .card-detail {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .detail-label {
          color: #718096;
        }

        .detail-value {
          font-weight: 600;
          color: var(--secondary-blue);
        }

        .carousel-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .carousel-button {
          background: var(--light-blue);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .carousel-button:hover {
          background: var(--primary-blue);
        }

        /* Footer */
        footer {
          background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
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

          .footer-content {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
      <ChatbotButton />
    </>
  );
};

export default LandingPage;
