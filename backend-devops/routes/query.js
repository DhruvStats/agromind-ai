const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");

/* ✅ ASK ROUTE (AI + MLOPS) */
router.post("/ask", async (req, res) => {
  try {
    const text = req.body.text;

    if (!text || text.trim() === "") {
      return res.json({ answer: "Please ask something" });
    }

    console.log("📩 User Query:", text);

    // ✅ ✅ ✅ STEP 1: CALL ML SERVICE (MLOPS)
    let mlResult = "";

    try {
      const mlRes = await axios.post(
        "http://ml-service:8000/predict",
        { text: text }
      );

      mlResult = mlRes.data.result;
      console.log("📊 ML Result:", mlResult);

    } catch (mlErr) {
      console.log("⚠️ ML SERVICE NOT AVAILABLE");
      mlResult = "ML unavailable";
    }

    // ✅ ✅ ✅ STEP 2: CALL AI API (LLM)
    let answer = "";

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are AgroMind AI 🌾. Help farmers with useful and clear answers."
            },
            {
              role: "user",
              content: text
            }
          ]
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.GROQ_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      answer =
        response?.data?.choices?.[0]?.message?.content ||
        "No response from AI";

    } catch (apiError) {
      console.error("AI ERROR:", apiError.message);
      answer = "⚠️ AI not responding";
    }

    // ✅ ✅ ✅ STEP 3: COMBINE ML + AI
    const finalAnswer = `
${answer}

📊 ML Insight: ${mlResult}
`;

    // ✅ ✅ ✅ STEP 4: SAVE TO MONGODB (NO DUPLICATE SPAM)
    const last = await Chat.findOne().sort({ createdAt: -1 });

    if (!last || last.question.trim() !== text.trim()) {
      await Chat.create({
        question: text,
        answer: finalAnswer,
        createdAt: new Date()
      });
    }

    // ✅ ✅ ✅ STEP 5: RESPONSE
    return res.json({ answer: finalAnswer });

  } catch (err) {
    console.error("SERVER ERROR:", err.message);
    return res.json({ answer: "❌ Server error" });
  }
});

/* ✅ HISTORY ROUTE */
router.get("/history", async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json(chats);

  } catch (err) {
    console.error("HISTORY ERROR:", err.message);
    return res.json([]);
  }
});

module.exports = router;
``