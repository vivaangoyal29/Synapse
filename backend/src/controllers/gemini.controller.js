import axios from "axios";

export const sendToGemini = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use gemini-2.5-flash (the latest stable model available in your API)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    console.log("✅ Gemini responded successfully");
    return res.json({ text, chatId });

  } catch (error) {
    console.error("❌ Gemini error:", error.response?.data || error.message);
    
    res.status(500).json({ 
      error: "Failed to get response from Gemini",
      details: error.response?.data?.error?.message || error.message
    });
    }
};
