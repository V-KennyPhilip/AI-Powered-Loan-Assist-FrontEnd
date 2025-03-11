import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentFlow, setCurrentFlow] = useState('initial');

  // const userEmail = 'john@example.com';
  const userId = 4;

  // Static welcome message to display immediately when the chat opens.
  const staticMessage = {
    id: 1,
    text: "Welcome to our Chatbot! How can we help you today?",
    sender: 'bot'
  };

  // When the chat opens, fetch the initial prompt (prompt id 0) if there are no messages
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([staticMessage]);
      fetchPrompt(0);
    }
  }, [isChatOpen]);

  // Toggle the chat window.
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // Fetch prompt data from the backend using the provided API structure.
  const fetchPrompt = async (promptId, additional = 0) => {
    console.log('Fetching prompt with id:', promptId);
    try {
      const response = await fetch(
        `http://localhost:8080/api/userbot/query?prompt_id=${promptId}&userId=${userId}&additional=${additional}`,
        {
          headers: {  
            Accept: 'application/json'
          },
          credentials: 'include'
        }
      );
      const data = await response.json();
      if (data && data.success) {
        const { mainPromptText, responseText, followups, extraAction } = data.data;
        const newMessage = {
          id: messages.length + 1,
          text: mainPromptText,
          response: responseText, // optional extra response text
          sender: 'bot',
          options: followups.map((followup) => ({
            id: followup.promptId,
            text: followup.text,
          })),
          extraAction,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        console.error('Failed to retrieve prompt data.');
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
    }
  };
  

  // Handle sending a free text message.
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        text: inputMessage,
        sender: 'user',
      },
    ]);
    // (Optional: You might process free text input differently or send it to your backend.)
    setInputMessage('');
  };

  // Handle a user clicking one of the follow-up option buttons.
  const handleOptionClick = (optionId, optionText) => {
    // Log the user's option selection.
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        text: `${optionText}`,
        sender: 'user',
      },
    ]);

    // If the option is to go back to the main menu, reset the chat.
    if (optionId === 'back') {
      setMessages([]);
      fetchPrompt(0);
    } else {
      // Otherwise, fetch the next prompt using the clicked prompt id.
      fetchPrompt(optionId);
    }
  };

  return (
    <>
  {isChatOpen && <div className="chatbot-overlay" onClick={toggleChat}></div>}

  <div
    className={`chatbot-float-btn ${isChatOpen ? 'slide-out' : ''}`}
    onClick={toggleChat}
  >
    <MessageCircle size={24} />
  </div>

  <div className={`chatbot-container ${isChatOpen ? 'open' : ''}`}>
    <div className="chatbot-header">
      <div className="chatbot-title">
        <Bot size={20} />
        <span>Support Assistant</span>
      </div>
      <button className="chatbot-close" onClick={toggleChat}>
        <X size={20} />
      </button>
    </div>
    <div className="chatbot-messages">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.sender}`}>
          <div className="message-content">
            {message.text}
            {message.response && (
              <div className="message-response">{message.response}</div>
            )}
            {message.options && message.options.length > 0 ? (
              <div className="message-options">
                {message.options.map((option, idx) => (
                  <button
                    key={`${message.id}-${option.id}-${idx}`}
                    onClick={() => handleOptionClick(option.id, option.text)}
                    className="option-btn"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              // When there are no followups, display extraAction if it exists.
              message.extraAction && (
                <div className="extra-action">
                  {Object.entries(message.extraAction).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
    <div className="chatbot-input-area">
      <input
        type="text"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <button onClick={handleSendMessage}>
        <Send size={20} />
      </button>
    </div>
  </div>
      <style> {`
        /* Floating Button Styles */
        .chatbot-float-btn {
            position: fixed;
            bottom: 20px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #3b82f6;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
          }

          .chatbot-float-btn.slide-out {
            transform: translateX(-460px); /* slides left */
            opacity: 100;
          }

          .chatbot-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            transition: opacity 0.3s ease;
          }
          
          .chatbot-float-btn:hover {
            background-color: #2563eb;
            /* transform: scale(1.1); */
          }
          
          /* Chatbot Container Styles */
          .chatbot-container {
            position: fixed;
            bottom: 20px;
            right: -500px;
            width: 450px;
            height: 520px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 1000;
          }
          
          .chatbot-container.open {
            right: 30px;
          }
          
          /* Chatbot Header */
          .chatbot-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: #3b82f6;
            color: white;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          
          .chatbot-title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .chatbot-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
          }
          
          /* Messages Area */
          .chatbot-messages {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .message {
            max-width: 80%;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
          }
          
          .message.bot {
            background-color:rgb(62, 134, 227);
            align-self: flex-start;
          }
          
          .message.user {
            // background-color: #3b82f6;
            background-color:rgb(56, 71, 233);
            color: white;
            align-self: flex-end;
          }
          
          .message-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          
          .option-btn {
            background-color: #60a5fa;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          
          .option-btn:hover {
            background-color: #2563eb;
          }
          
          /* Input Area */
          .chatbot-input-area {
            display: flex;
            padding: 15px;
            background-color: #f3f4f6;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }
          
          .chatbot-input-area input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            margin-right: 10px;
          }
          
          .chatbot-input-area button {
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          } 
      `} </style>
    </>
  );
};

export default Chatbot;