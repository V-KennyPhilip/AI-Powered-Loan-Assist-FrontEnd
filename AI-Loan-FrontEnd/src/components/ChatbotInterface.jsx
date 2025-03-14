import React, { useState, useEffect, useRef } from 'react';
import './ChatbotInterface.css';
import { v4 as uuidv4 } from 'uuid';

const ChatbotInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [mainOptions, setMainOptions] = useState([]);
  const [menuHistory, setMenuHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingMessage, setTypingMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const staticMessage = "Hello! I'm your Loans24 assistant. How can I help you today?";

  useEffect(() => {
    const staticMessageId = uuidv4();
    // Start with an empty text to simulate typing
    setMessages([{ id: staticMessageId, text: '', isBot: true }]);
    simulateTyping(staticMessage, staticMessageId);
    fetchInitialOptions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, options]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInitialOptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/chatbot/interaction', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data.initialPrompts) {
        setOptions(data.data.initialPrompts);
        setMainOptions(data.data.initialPrompts);
      }
    } catch (error) {
      console.error('Error fetching initial options:', error);
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Sorry, there was an error connecting to the service. Please try again later.',
          isBot: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (promptId, promptText) => {
    // Add the user's message
    const userMessageId = uuidv4();
    setMessages(prev => [
      ...prev,
      { id: userMessageId, text: promptText, isBot: false }
    ]);
    setIsLoading(true);
    setOptions([]); // Clear options while loading new data

    try {
      const response = await fetch(`http://localhost:8080/api/chatbot/interaction?prompt_id=${promptId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data.response) {
        const botMessageId = uuidv4();
        // Start with an empty text for typing effect
        setMessages(prev => [
          ...prev,
          { id: botMessageId, text: '', isBot: true }
        ]);
        simulateTyping(data.data.response.text, botMessageId);
        // If new prompts are provided, save current options to history and update
        if (data.data.nextPrompts && data.data.nextPrompts.length > 0) {
          setMenuHistory(prev => [...prev, options]);
          setOptions(data.data.nextPrompts);
        } else {
          // Even if no new prompts, display the back buttons
          setOptions([]);
        }
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Sorry, there was an error. Please try again.',
          isBot: true
        }
      ]);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a letter-by-letter typing effect
  const simulateTyping = (fullText, messageId) => {
    setTypingMessage(messageId);
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, text: fullText.slice(0, currentIndex) } : msg
        )
      );
      if (currentIndex === fullText.length) {
        clearInterval(interval);
        setTypingMessage(null);
      }
    }, 10); // Adjust the speed (ms per character) as needed
  };

  // Go back one menu level
  const handleBack = () => {
    setMenuHistory(prevHistory => {
      if (prevHistory.length > 0) {
        const newHistory = [...prevHistory];
        const previousOptions = newHistory.pop();
        setOptions(previousOptions);
        return newHistory;
      }
      return prevHistory;
    });
  };

  // Return to the main (initial) menu
  const handleBackToMain = () => {
    setMenuHistory([]);
    setOptions(mainOptions);
  };

  return (
    <div className="chatbot-interface">
      <div className="chatbot-header">
        <h3>Loans24 Assistant</h3>
        <button className="close-button" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="chatbot-messages">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.isBot ? 'bot-message' : 'user-message'} ${typingMessage === message.id ? 'typing' : ''}`}
          >
            <div className="message-text">
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {isLoading && !typingMessage && (
          <div className="message bot-message typing">
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

        {/* Render the options container (if not loading and not typing) */}
        { !isLoading && !typingMessage && (
          <div className="chatbot-options">
            <div className="options-buttons">
              {options.length > 0 &&
                options.map(option => (
                  <button
                    key={option.prompt_id || uuidv4()}
                    className="option-button"
                    onClick={() => handleOptionClick(option.prompt_id, option.text)}
                  >
                    {option.text}
                  </button>
                ))
              }
            </div>
            <div className="back-buttons">
              <button className="option-button" onClick={handleBack}>Back</button>
              <button className="option-button" onClick={handleBackToMain}>Main Menu</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotInterface;