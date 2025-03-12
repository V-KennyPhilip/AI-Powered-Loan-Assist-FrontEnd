import React, { useState, useEffect, useContext } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { UserContext } from './context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import DynamicForm from './DynamicForm';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentFlow, setCurrentFlow] = useState('initial');
  const [updateConfig, setUpdateConfig] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;

  // Helper to safely render values that might be objects.
  const renderSafe = (value) => {
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return value;
  };

  // When the chat opens, if no messages exist, generate a new conversation ID,
  // add the static welcome message, and fetch the initial prompt.
  useEffect(() => {
    if (isChatOpen && messages.length === 0 && userId) {
      const newConversationId = uuidv4();
      setConversationId(newConversationId);
      setMessages([
        {
          id: uuidv4(),
          conversationId: newConversationId,
          text: "Welcome to our Chatbot! How can we help you today?",
          sender: 'bot'
        }
      ]);
      fetchPrompt(0, userId, newConversationId);
    }
  }, [isChatOpen, userId]);

  // Toggle the chat window.
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  /**
   * fetchPrompt now accepts:
   * - promptId, userId, conversationId, optional additional parameter
   * - httpMethod: the HTTP method to use ('GET' by default)
   * - bodyData: optional data for PUT/POST requests (will be used if provided)
   */
  const fetchPrompt = async (
    promptId,
    userId,
    convId = conversationId,
    additional = null,
    httpMethod = 'GET',
    bodyData = null
  ) => {
    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    let url = `http://localhost:8080/api/userbot/query`;
    // Always include query parameters for prompt_id and userId.
    const params = new URLSearchParams({
      prompt_id: promptId,
      userId: userId,
    });
    if (additional !== null && typeof additional === 'number') {
      params.append('additional', additional);
    }
    url += `?${params.toString()}`;

    const options = {
      method: httpMethod,
      headers: {
        Accept: 'application/json'
      },
      credentials: 'include'
    };

    if (httpMethod === 'PUT' || httpMethod === 'POST') {
      options.headers['Content-Type'] = 'application/json';
      // Only send the form data in the body.
      options.body = JSON.stringify(bodyData ? bodyData : {});
    }

    console.log(
      'Fetching prompt with id:',
      promptId,
      'and userId:',
      userId,
      `using ${httpMethod} method`,
      additional !== null ? `, additional: ${additional}` : ''
    );

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (data && data.success) {
        const { mainPromptText, responseText, followups, extraAction, intent } = data.data;
        const newMessage = {
          id: uuidv4(),
          conversationId: convId,
          text: renderSafe(mainPromptText),
          response: renderSafe(responseText),
          sender: 'bot',
          // Include the HTTP request type (method) in each followup option.
          options: followups.map(followup => ({
            id: followup.promptId,
            text: renderSafe(followup.text),
            method: followup.httpRequestType, // e.g., 'GET', 'PUT', or 'POST'
            fieldsToAdd: followup.fieldsToAdd // if provided for dynamic form input
          })),
          intent,
          extraAction,
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        // setSuccessMessage("Request processed successfully!");
      } else {
        console.error('Failed to retrieve prompt data.');
        // On error, extract error details from the data field.
        let errorText = "";
        if (data && data.data) {
          errorText = Object.entries(data.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" | ");
        } else {
          errorText = data && data.message ? data.message : "Failed to retrieve prompt data.";
        }
        const errorMessageBot = {
          id: uuidv4(),
          conversationId: convId,
          text: errorText,
          sender: 'bot'
        };
        setMessages(prev => [...prev, errorMessageBot]);
      }
      return response;
    } catch (error) {
      console.error('Error fetching prompt:', error);
      const errorMessageBot = {
        id: uuidv4(),
        conversationId: convId,
        text: "Failed to retrieve prompt data: " + error.message,
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessageBot]);
      throw error;
    }
  };

  // Handle sending a free text message.
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    const newUserMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');
  };

  // Modified handleOptionClick to check for PUT/POST fields.
  const handleOptionClick = (option) => {
    const { id, text, method, fieldsToAdd } = option;
    const newUserMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      text: text,
      sender: 'user'
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    // Clear previous messages.
    // setErrorMessage('');
    // setSuccessMessage('');

    // If this followup requires user input before sending (PUT or POST with fields)
    if ((method === 'PUT') || (method === 'POST' && fieldsToAdd)) {
      let fields = [];
      if (method === 'PUT') {
        // For PUT, parse fields from the prompt text (e.g., "Please provide the updated details[salary/income type]")
        const match = text.match(/\[(.*?)\]/);
        if (match) {
          fields = match[1].split('/').map(field => field.trim());
        }
      } else if (method === 'POST' && fieldsToAdd) {
        fields = fieldsToAdd;
      }
      // Set configuration to display the dynamic form.
      setUpdateConfig({
        method,       // 'PUT' or 'POST'
        promptId: id, // prompt id for the subsequent request
        fields,       // parsed fields configuration
        promptText: text
      });
    } else if (id === 'back') {
      // For a "back" option, reset conversation or return to main menu.
      setMessages([]);
      fetchPrompt(0, userId, conversationId);
    } else {
      fetchPrompt(id, userId, conversationId, null, method)
      .catch(error => {
        console.error("Error fetching prompt:", error);
        const errorMessageBot = {
          id: uuidv4(),
          conversationId: conversationId,
          text: "Failed to retrieve prompt data: " + error.message,
          sender: 'bot'
        };
        setMessages(prev => [...prev, errorMessageBot]);
      });
    }
  };

  // This handler is called when the dynamic form is submitted.
  const handleFormSubmit = async (formData) => {
    if (updateConfig) {
      try {
        const response = await fetchPrompt(
          updateConfig.promptId,
          userId,
          conversationId,
          null,
          updateConfig.method,
          formData
        );
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        // setSuccessMessage("Request processed successfully!");
      } catch (error) {
        console.error("Error while processing request:", error);
        const errorMessageBot = {
          id: uuidv4(),
          conversationId: conversationId,
          text: "Failed to process request: " + error.message,
          sender: 'bot'
        };
        setMessages(prev => [...prev, errorMessageBot]); 
      } finally {
        setUpdateConfig(null);
      }
    }
  };

  return (
    <>
      {isChatOpen && <div className="chatbot-overlay" onClick={toggleChat}></div>}
      
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

        {/* Status Messages (error/success) inside the container */}
        {/* <div className="chatbot-status">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div> */}

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div>{renderSafe(message.text)}</div>
                {message.response && (
                  <div className="message-response">{renderSafe(message.response)}</div>
                )}
                {message.options && message.options.length > 0 ? (
                  <div className="message-options">
                    {message.options.map((option, idx) => (
                      <button
                        key={`${message.id}-${option.id}-${idx}`}
                        onClick={() => handleOptionClick(option)}
                        className="option-btn"
                      >
                        {renderSafe(option.text)}
                      </button>
                    ))}
                  </div>
                ) : (
                  // When there are no followups, display extraAction if it exists.
                  message.extraAction && (
                    <div className="extra-action">
                      {typeof message.extraAction === 'object'
                        ? Object.entries(message.extraAction).map(([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {renderSafe(value)}
                            </div>
                          ))
                        : <div>{renderSafe(message.extraAction)}</div>
                      }
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

      {/* Render DynamicForm if updateConfig is set */}
      {updateConfig && (
        <DynamicForm
          config={updateConfig}
          onSubmit={handleFormSubmit}
          onCancel={() => setUpdateConfig(null)}
        />
      )}
      <div
        className={`chatbot-float-btn ${isChatOpen ? 'slide-out' : ''}`}
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
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

          // .error-message {
          //   background-color: #f44336;
          //   color: #fff;
          //   padding: 10px;
          //   margin: 10px 0;
          //   border-radius: 4px;
          //   text-align: center;
          // }

          // .success-message {
          //   background-color: #4caf50;
          //   color: #fff;
          //   padding: 10px;
          //   margin: 10px 0;
          //   border-radius: 4px;
          //   text-align: center;
          // }

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

          /* Status messages placed inside the chatbot */
          // .chatbot-status {
          //   position: absolute;
          //   top: 60px;
          //   left: 0;
          //   width: 100%;
          //   z-index: 1100;
          //   text-align: center;
          //   padding: 0 15px;
          // }
          
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

          /* Dynamic Form Overlay */
          .dynamic-form-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
      `} </style>
    </>
  );
};

export default Chatbot;