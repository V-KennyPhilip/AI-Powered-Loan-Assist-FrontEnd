import React, { useState, useEffect, useContext } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { UserContext } from './context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import DynamicForm from './DynamicForm';
import './ChatBot.css'

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [updateConfig, setUpdateConfig] = useState(null);
  // New state to hold the selected loan id
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;

  // Helper to safely render values that might be objects.
  const renderSafe = (value) => {
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return value;
  };

  // When the chat opens, generate a conversation and fetch the initial prompt.
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
   * Modified fetchPrompt that accepts:
   * - promptId, userId, conversationId, optional additional parameter,
   * - httpMethod (default 'GET'), and optional bodyData.
   * 
   * IMPORTANT: If no additional parameter is provided and selectedLoanId exists,
   * we automatically append it.
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
    
    // Use selectedLoanId if available and additional is null
    if (additional === null && selectedLoanId !== null) {
      additional = selectedLoanId;
    }

    let url = `http://localhost:8080/api/userbot/query`;
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
      options.body = JSON.stringify(bodyData || {});
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
        const { responseText, followups, extraAction, intent } = data.data;
        const botReply = responseText;
        const newMessage = {
          id: uuidv4(),
          conversationId: convId,
          text: renderSafe(botReply),
          // response: renderSafe(responseText),
          sender: 'bot',
          options: followups.map(followup => ({
            id: followup.promptId,
            text: renderSafe(followup.text),
            method: followup.httpRequestType,
            fieldsToAdd: followup.fieldsToAdd
          })),
          intent,
          extraAction,
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } else {
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

  // Handle click on a followup option.
  const handleOptionClick = (option) => {
    const { id, text, method, fieldsToAdd } = option;
    const newUserMessage = {
      id: uuidv4(),
      conversationId: conversationId,
      text: text,
      sender: 'user'
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    if ((method === 'PUT') || (method === 'POST' && fieldsToAdd)) {
      let fields = [];
      if (method === 'PUT') {
        const match = text.match(/\[(.*?)\]/);
        if (match) {
          fields = match[1].split('/').map(field => field.trim());
        }
      } else if (method === 'POST' && fieldsToAdd) {
        fields = fieldsToAdd;
      }
      setUpdateConfig({
        method,
        promptId: id,
        fields,
        promptText: text
      });
    } else if (id === 'back') {
      setMessages([]);
      fetchPrompt(0, userId, conversationId);
    } else {
      // This call will include the additional parameter if a loan is selected.
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

  // Handle dynamic form submissions.
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

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                {/* Display bot reply from responseText */}
                <div>{renderSafe(message.text)}</div>
                
                {/* Render followup options if available */}
                {message.options && message.options.length > 0 && (
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
                )}

                {/* If extraAction contains loans, render loan buttons */}
                {message.extraAction && message.extraAction.loans && (
                  <div className="loan-buttons">
                    {message.extraAction.loans.map((loan) => (
                      <button
                        key={loan.loan_id}
                        onClick={() => setSelectedLoanId(loan.loan_id)}
                        className={`loan-btn ${selectedLoanId === loan.loan_id ? 'selected' : ''}`}
                      >
                        {loan.type}
                        {selectedLoanId === loan.loan_id && (
                          <span className="tick-mark">✔</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* If extraAction exists and it's not a loans object, display its fields */}
                {message.extraAction && !message.extraAction.loans && (
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
                )}
              </div>
            </div>
          ))}
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
    </>
  );
};

export default Chatbot;