import React, { useState, useEffect } from 'react';
import './Loanie.css';
import axios from 'axios';

const funFacts = [
  "The word 'mortgage' comes from Old French, literally meaning 'death pledge'!",
  "The average American has approximately $90,460 in personal debt.",
  "The world's first recorded lending system dates back to ancient Mesopotamia around 2000 BCE.",
  "Student loans are the second-largest category of consumer debt in the US, behind mortgages.",
  "The Rule of 72 is a simple way to determine how long it'll take to double your investment. Just divide 72 by your interest rate!",
  "The average mortgage term in Japan can be up to 100 years, sometimes extending beyond the borrower's lifetime.",
  "In Denmark, you can get a mortgage with a negative interest rate, where the bank pays you!",
  "The 30-year mortgage became popular in the US after the Great Depression to make homes more affordable."
];

const LoanieApp = () => {
  const [loading, setLoading] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentDraftInput, setCurrentDraftInput] = useState('');
  const [response, setResponse] = useState(null);
  const [queryId, setQueryId] = useState(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chatHistoryList, setChatHistoryList] = useState([
    { id: 1, title: "Mortgage loans" },
    { id: 2, title: "Student loan options" }
  ]);

  // Rotate through fun facts while loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setCurrentFact(prev => (prev + 1) % funFacts.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;
    
    // Store the current input
    const currentInput = userInput;
    
    // Add user question to chat history
    const newMessage = { id: Date.now(), text: currentInput, sender: 'user' };
    setChatHistory([...chatHistory, newMessage]);
    
    // Set loading state
    setLoading(true);
    setResponse(null);
    
    // Clear the input field for the current submission, but keep a copy
    setCurrentDraftInput(userInput);
    setUserInput('');
    
    try {
      // Call your backend API using axios
      const result = await axios.get('http://localhost:8080/genericchatbot', {
        params: { userInput: currentInput }
      });
      
      // Store the response and query ID
      setResponse(result.data);
      if (result.data.queryId) {
        setQueryId(result.data.queryId);
      }
      
      // Add bot response to chat history
      const botResponse = { 
        id: Date.now() + 1, 
        text: result.data.response || result.data.message, 
        sender: 'bot' 
      };
      setChatHistory(prev => [...prev, botResponse]);
      
      // Add this query to chat history list for sidebar
      const newHistoryItem = {
        id: Date.now(),
        title: currentInput.length > 25 ? currentInput.substring(0, 25) + '...' : currentInput
      };
      setChatHistoryList(prev => [newHistoryItem, ...prev]);
      
    } catch (error) {
      console.error('Error fetching response:', error);
      // Add error message to chat
      setChatHistory(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Sorry, there was an error processing your request.", 
        sender: 'bot' 
      }]);
    } finally {
      setLoading(false);
      
      // Restore the draft input if the user hasn't typed anything new
      if (userInput === '') {
        setUserInput(currentDraftInput);
      }
      setCurrentDraftInput('');
    }
  };
  
  const downloadExcel = () => {
    if (!queryId) return;
    
    // Create an anchor element to download the file
    const downloadLink = document.createElement('a');
    downloadLink.href = `http://localhost:8080/download/${queryId}`;
    downloadLink.download = `loan_data_${queryId}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Handle input change while preserving user's typing
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="loanie-container">
      {/* Header section */}
      <header className="loanie-header">
        <div className="logo-container">
          <h1 className="loanie-logo">Loanie</h1>
          <div className="floating-elements">
            <span className="floating-icon">💰</span>
            <span className="floating-icon">📊</span>
            <span className="floating-icon">💵</span>
          </div>
        </div>
      </header>
      
      <div className="app-content">
        {/* Sidebar for desktop */}
        <aside className="sidebar">
          <div className="search-container">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search loans..."
            />
          </div>
          
          <button className="new-chat-btn">
            <span className="plus-icon">+</span> New Chat
          </button>
          
          <div className="chat-history">
            {chatHistoryList.map(item => (
              <div key={item.id} className="history-item">{item.title}</div>
            ))}
          </div>
        </aside>
        
        {/* Main content area */}
        <main className="main-content">
          <div className="chat-container">
            {chatHistory.map(message => (
              <div 
                key={message.id} 
                className={`chat-bubble ${message.sender === 'user' ? 'user' : 'bot'}`}
              >
                {message.text}
              </div>
            ))}
            
            {loading && (
              <div className="loading-container">
                <div className="loading-animation">
                  <div className="piggy-bank">
                    <div className="coin"></div>
                    <div className="coin"></div>
                    <div className="coin"></div>
                  </div>
                </div>
                <div className="fun-fact">
                  <h3>Did you know?</h3>
                  <p>{funFacts[currentFact]}</p>
                </div>
              </div>
            )}
            
            {response && !loading && queryId && (
              <div className="response-actions">
                <button 
                  className="action-btn chart-btn"
                  onClick={() => setChartVisible(!chartVisible)}
                >
                  {chartVisible ? 'Hide Chart' : 'Display Chart'}
                </button>
                <button 
                  className="action-btn excel-btn"
                  onClick={downloadExcel}
                >
                  Download Excel
                </button>
              </div>
            )}
            
            {chartVisible && response && (
              <div className="chart-container animated-chart">
                <div className="chart-bar" style={{height: '60px'}}></div>
                <div className="chart-bar" style={{height: '120px'}}></div>
                <div className="chart-bar" style={{height: '80px'}}></div>
                <div className="chart-bar" style={{height: '150px'}}></div>
                <div className="chart-bar" style={{height: '100px'}}></div>
              </div>
            )}
          </div>
          
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Ask about loans..."
              className="user-input"
            />
            <button 
              type="submit" 
              className={`send-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="music-loader">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              ) : (
                <span className="send-icon">➤</span>
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default LoanieApp;