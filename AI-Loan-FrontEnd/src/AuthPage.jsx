import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import Chatbot from './ChatBot';


import exampleLogo from './assets/Loans24Logo.png';
import partner1 from './assets/Aditya-Birla-Finance-Ltd.png';
import partner2 from './assets/Poonawaala.png';
import partner3 from './assets/Tata_Capital_Logo.png';

const AuthPage = () => {
  // Feature carousel data
  const features = [
    {
      title: "Watch all our benefits",
      description: "Explore a range of benefits for complete peace of mind."
    },
    {
      title: "AI-powered matching logic",
      description: "Our AI-powered IntelliMatch will find the ideal loan partner for you."
    },
    {
      title: "One stop solution",
      description: "Compare loan details, EMIs, and interest rates all in one place."
    }
  ];

  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Auto-cycle through features every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start buffer animation
    const endpoint = isLogin 
      ? 'http://localhost:8080/api/login'
      : 'http://localhost:8080/api/signup';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(formData)
      });
  
      // Parse the response JSON
      const data = await response.json();
  
      if (!response.ok) {
        // If error, show the error message from the backend
        setMessage({ type: 'error', text: data.message || 'Authentication failed.' });
        setIsLoading(false);
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // localStorage.setItem('token', data.token);
  
      // On success, show a success message from the backend
      // setMessage({ type: 'success', text: data.message || (isLogin ? 'Login successful!' : 'Signup successful!') });
      
      if (isLogin) {
        setMessage({ type: 'success', text: data.message || 'Login successful!' });
        setIsLoading(false);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
      // Signup branch: show message and switch to login view
        setMessage({ type: 'success', text: data.message || 'Signup successful! Please log in.' });
        setFormData({ email: '', password: '', name: '', phone: '' });
        setIsLoading(false);
        setTimeout(() => setMessage(null), 3000);
        // Switch to login layout
        setIsLogin(true);
    }

  } catch (error) {
      console.error('Error sending request:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };
  

  return (
    <div className="page-container">
      {/* Message Box: appears when a message is set */}
        {message && (
          <div className={`message-box ${message.type}`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="dismiss-button">
                Dismiss
            </button>
          </div>
        )}
        {/* Loading Spinner */}
        {isLoading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
      {/* LEFT CONTENT */}
      <div className="left-content">
        {/* Top Info Section */}
        <header className="info-header">
          <img src={exampleLogo} alt="Company Logo" className="company-logo" />
          <h1 className="company-name">Loans24</h1>
        </header>

        {/* Feature Carousel */}
        <div className="feature-carousel">
          <div className="feature-card">
            <h2>{features[currentFeature].title}</h2>
            <p>{features[currentFeature].description}</p>
          </div>    
        </div>

        {/* IntelliMatch & Partners Section */}
        <section className="intellimatch-section">
          <p className="intellimatch-text">
            Our AI-powered IntelliMatch will find the perfect loan partner, tailored to your needs.
          </p>
          <p className="partners-title">10+ LOANS24 partners</p>
          <div className="partners-logos">
            <img src={partner1} alt="Partner 1" />
            <img src={partner2} alt="Partner 2" />
            <img src={partner3} alt="Partner 3" />
          </div>
        </section>
      </div>

      {/* RIGHT CONTENT */}
      <div className="right-content">
        <div className="auth-container">
          {/* Auth Toggle */}
          <div className="auth-toggle">
            <button
              className={`auth-toggle-button ${isLogin ? 'active' : 'inactive'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`auth-toggle-button ${!isLogin ? 'active' : 'inactive'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-wrapper">
              <Mail className="icon" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
                className="input-field"
              />
            </div>

            {!isLogin && (
              <>
                <div className="input-wrapper">
                  <User className="icon" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="input-field"
                  />
                </div>
                <div className="input-wrapper">
                  <Phone className="icon" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                    className="input-field"
                  />
                </div>
              </>
            )}

            <div className="input-wrapper">
              <Lock className="icon" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="input-field"
              />
            </div>

            <button type="submit" className="submit-button">
              {isLogin ? 'Login' : 'Create Account'}
            </button>

            <div className="switch-text">
              <p>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="switch-button"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        /* PAGE CONTAINER */
        .page-container {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(to bottom right, #1e3a8a, #312e81);
          overflow: hidden;
          padding: 2rem 1rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .page-container {
            flex-direction: row;
            align-items: stretch;
            justify-content: space-between;
          }
        }
          .message-box {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1100;
            animation: slideDown 0.5s ease-out;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          /* Success style */
          .message-box.success {
            background-color: #d1fae5;
            color: #065f46;
          }

          /* Error style */
          .message-box.error {
            background-color: #fee2e2;
            color: #991b1b;
          }
            .dismiss-button {
          background: transparent;
          border: none;
          color: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        /* Spinner CSS for buffer animation */
        .spinner-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1200;
        }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #ffffff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translate(-50%, -20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }


        /* LEFT CONTENT */
        .left-content {
          width: 100%;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .left-content {
            width: 45%;
            margin-bottom: 0;
          }
        }
        .info-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }
        .company-logo {
          width: 80px;
          height: auto;
          margin-bottom: 1rem;
        }
        .company-name {
          font-size: 2rem;
          color: #fff;
          margin: 0;
        }

        /* FEATURE CAROUSEL */
        .feature-carousel {
          position: relative;
          width: 100%;
          height: 150px; /* Adjust height as needed */
          margin-bottom: 2rem;
          overflow: hidden;
        }
        .feature-card {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: opacity 0.5s ease-in-out;
        }
        .feature-card h2 {
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .feature-card p {
          color: #d1d5db;
        }

        /* INTELLIMATCH & PARTNERS */
        .intellimatch-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        .intellimatch-text {
          color: #fff;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        .partners-title {
          color: #93c5fd;
          margin-bottom: 1rem;
          font-weight: bold;
        }
        .partners-logos {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .partners-logos img {
          height: 40px;
          width: auto;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
          background: #fff;
          border-radius: 4px;
          padding: 0.25rem;
        }

        /* RIGHT CONTENT */
        .right-content {
          width: 100%;
        }
        @media (min-width: 768px) {
          .right-content {
            width: 55%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }

        /* AUTH CONTAINER (Increased size) */
        .auth-container {
          width: 100%;
          max-width: 600px; /* Increased width */
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2.5rem 2rem; /* Increased padding for extra height */
          margin: 0 auto 2rem;
        }
        @media (min-width: 768px) {
          .auth-container {
            margin: 0;
          }
        }
        .auth-toggle {
          display: flex;
          margin-bottom: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          padding: 0.25rem;
        }
        .auth-toggle-button {
          flex: 1;
          padding: 0.5rem;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .auth-toggle-button.active {
          background-color: #2563eb;
          color: #ffffff;
        }
        .auth-toggle-button.inactive {
          color: #bfdbfe;
          background: transparent;
        }
        .auth-toggle-button.inactive:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .input-wrapper {
          position: relative;
        }
        .icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #60a5fa;
        }
        .input-field {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #ffffff;
          font-size: 1rem;
        }
        .input-field::placeholder {
          color: #bfdbfe;
        }
        .input-field:focus {
          outline: none;
          box-shadow: 0 0 0 2px #3b82f6;
        }
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(to right, #2563eb, #4f46e5);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .submit-button:hover {
          background: linear-gradient(to right, #1d4ed8, #3730a3);
        }
        .switch-text p {
          color: #bfdbfe;
          text-align: center;
        }
        .switch-button {
          background: none;
          border: none;
          color: #60a5fa;
          text-decoration: underline;
          cursor: pointer;
        }
        .switch-button:hover {
          color: #93c5fd;
        }
      `}</style>
          {/* <Chatbot/> */}
    </div>
  );
};

export default AuthPage;
