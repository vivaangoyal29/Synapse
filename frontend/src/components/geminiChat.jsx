import { useState } from 'react';
import { sendMessageToGemini } from '../lib/gemini';
import toast from 'react-hot-toast';

const GeminiChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    console.log('📤 Sending message:', message);
    
    setLoading(true);
    
    // Add user message to history
    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');

    try {
      const geminiResponse = await sendMessageToGemini(currentMessage);
      
      console.log('📥 Received response:', geminiResponse);
      
      // Add Gemini response to history
      setChatHistory(prev => [...prev, { role: 'gemini', text: geminiResponse }]);
      toast.success('Response received!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response from Gemini');
      setChatHistory(prev => [...prev, { role: 'gemini', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Chat with Gemini AI</h1>
      
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-slate-800 rounded-lg p-4">
        {chatHistory.length === 0 && (
          <p className="text-gray-400 text-center">Start a conversation with Gemini...</p>
        )}
        
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              chat.role === 'user' 
                ? 'bg-blue-600 ml-auto max-w-[80%]' 
                : 'bg-slate-700 mr-auto max-w-[80%]'
            }`}
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            <p className="font-semibold mb-1 text-white">
              {chat.role === 'user' ? 'You' : 'Gemini'}
            </p>
            <p className="whitespace-pre-wrap break-words text-gray-100">{chat.text}</p>
          </div>
        ))}
        
        {loading && (
          <div className="bg-slate-700 p-4 rounded-lg mr-auto max-w-[80%]">
            <p className="font-semibold mb-1 text-white">Gemini</p>
            <p className="text-gray-400">Thinking...</p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          id="gemini-message"
          name="geminiMessage"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default GeminiChat;