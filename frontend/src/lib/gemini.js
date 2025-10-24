const API_URL = 'http://localhost:3000/api/gemini'; // Change 5001 to 3000

export const sendMessageToGemini = async (message, chatId) => {
  try {
    console.log('🔵 Sending request to Gemini...', { message, chatId });
    
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        message,
        chatId
      })
    });

    console.log('🔵 Response status:', response.status);

    if (!response.ok) {
      throw new Error('Failed to get response from Gemini');
    }

    const data = await response.json();
    console.log('✅ Gemini response received:', data);
    return data.text;
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw error;
  }
};