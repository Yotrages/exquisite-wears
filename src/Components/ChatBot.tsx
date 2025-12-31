import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { apiClient } from '../Api/axiosConfig';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  source?: 'openai' | 'rule-based' | 'unknown';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // const [useAI, setUseAI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "Hi! 👋 I'm your shopping assistant. How can I help you today?",
        [
          "Track my order",
          "Find products",
          "Return policy",
          "Payment options"
        ]
      );
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, suggestions?: string[], source: 'openai' | 'rule-based' | 'unknown' = 'unknown') => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      suggestions,
      source
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    setInput('');
    addUserMessage(userInput);
    setLoading(true);

    try {
      // Call your AI chatbot backend endpoint
      const response = await apiClient.post(
        '/chatbot/chat',
        { message: userInput, useAI: true }
      );

      addBotMessage(response.data.reply, response.data.suggestions, response.data.source || 'unknown');
    } catch (error: any) {
      // Fallback to rule-based responses if AI endpoint not available
      const fallbackResponse = generateFallbackResponse(userInput);
      addBotMessage(fallbackResponse.text, fallbackResponse.suggestions, 'rule-based');
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackResponse = (input: string): { text: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();

    // Order tracking
    if (lowerInput.includes('track') || lowerInput.includes('order')) {
      return {
        text: "To track your order, please go to the Orders section in your account. You can also use your order ID to get real-time updates.",
        suggestions: ["View my orders", "Contact support", "Delivery time"]
      };
    }

    // Product search
    if (lowerInput.includes('find') || lowerInput.includes('search') || lowerInput.includes('product')) {
      return {
        text: "I can help you find products! What are you looking for? You can use the search bar at the top or tell me what category interests you.",
        suggestions: ["Show electronics", "Show fashion", "Show deals"]
      };
    }

    // Returns
    if (lowerInput.includes('return') || lowerInput.includes('refund')) {
      return {
        text: "We offer a 7-day return policy for most items. Items must be unused and in original packaging. Would you like to start a return?",
        suggestions: ["Return policy details", "Start a return", "Contact support"]
      };
    }

    // Payment
    if (lowerInput.includes('payment') || lowerInput.includes('pay')) {
      return {
        text: "We accept payments via Paystack (Card, Bank Transfer, USSD). All payments are 100% secure and encrypted.",
        suggestions: ["Supported cards", "Payment failed", "Request invoice"]
      };
    }

    // Shipping
    if (lowerInput.includes('shipping') || lowerInput.includes('delivery')) {
      return {
        text: "We offer delivery within 3-7 business days. Free shipping is available on orders above ₦50,000!",
        suggestions: ["Track delivery", "Shipping costs", "Delivery areas"]
      };
    }

    // Greeting
    if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
      return {
        text: "Hello! How can I assist you today? 😊",
        suggestions: ["Browse products", "Track order", "Help with returns"]
      };
    }

    // Default
    return {
      text: "I'm here to help! You can ask me about:\n• Tracking orders\n• Finding products\n• Returns & refunds\n• Payment options\n• Shipping info",
      suggestions: ["Track my order", "Find products", "Contact support"]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed md:bottom-6 bottom-16 left-3 z-[150] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3"
          aria-label="Open chat"
        >
          <FaComments className="text-2xl" />
          <span className="font-semibold pr-2">Need Help?</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            !
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-3 xs:right-6 z-[9999] w-[calc(100vw-1.5rem)] xs:w-96 max-w-96 h-[600px] max-h-[calc(100vh-5rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up\">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaRobot className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Shopping Assistant</h3>
                <p className="text-xs text-blue-100">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  {message.sender === 'user' ? (
                    <FaUser className="text-white text-sm" />
                  ) : (
                    <FaRobot className="text-gray-700 text-sm" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[75%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-900 rounded-tl-none shadow-md'
                  }`}>
                    <div className="flex items-center gap-2">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      {message.sender === 'bot' && message.source === 'openai' && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">AI</span>
                      )}
                      {message.sender === 'bot' && message.source === 'rule-based' && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Bot</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Suggestions */}
                  {message.suggestions && message.sender === 'bot' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions?.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-white hover:bg-blue-50 border border-blue-300 text-blue-600 text-xs px-3 py-1.5 rounded-full transition-colors shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <FaRobot className="text-gray-700 text-sm" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            {/* <div className="mb-2 flex items-center justify-between">
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input type="checkbox" className="rounded" checked={useAI} onChange={() => setUseAI(!useAI)} disabled={loading} />
                <span className="font-medium">Use AI (OpenAI)</span>
              </label>
              <span className="text-xs text-gray-400">AI replies may use third-party APIs</span>
            </div> */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-full transition-colors disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
