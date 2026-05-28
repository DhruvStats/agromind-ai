import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatUI.css";

const API = "http://localhost:5000/api";

function ChatUI() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  // ✅ Load history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(API + "/history");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch {
      setHistory([]);
    }
  };

  // ✅ SEND MESSAGE
  const sendMessage = async () => {
    if (!query.trim()) return;

    const text = query;

    setMessages(prev => [...prev, { type: "user", text }]);
    setQuery("");

    try {
      const res = await axios.post(API + "/ask", { text });

      setMessages(prev => [
        ...prev,
        { type: "ai", text: res.data.answer }
      ]);

      fetchHistory();

    } catch {
      setMessages(prev => [
        ...prev,
        { type: "ai", text: "❌ Server error" }
      ]);
    }
  };

  // ✅ IMAGE UPLOAD
  const handleImage = (file) => {
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setMessages(prev => [
      ...prev,
      {
        type: "user",
        text: "📷 Uploaded image",
        image: imageURL
      }
    ]);
  };

  return (
    <div className="app">

      {/* ✅ SIDEBAR */}
      <div className="sidebar">
        <h2>🌾 AgroMind</h2>

        <button onClick={() => setMessages([])}>New Chat</button>

        <div className="historyList">
          {history.map((item, i) => (
            <div
              key={i}
              className="historyItem"
              onClick={() =>
                setMessages([
                  { type: "user", text: item.question },
                  { type: "ai", text: item.answer }
                ])
              }
            >
              {(item.question || "").substring(0, 25)}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ MAIN */}
      <div className="main">

        {/* ✅ CHAT */}
        <div className="chatBox">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.type}`}>

              <b>{msg.type === "user" ? "🧑 You:" : "🤖 AgroMind:"}</b>

              {/* ✅ AI TEXT SPLIT */}
              {msg.text && (
                <p>
                  {msg.text.split("📊 ML Insight:")[0]}
                </p>
              )}

              {/* ✅ ML BOX */}
              {msg.text && msg.text.includes("📊 ML Insight:") && (
                <div className="mlBox">
                  📊 {
                    msg.text.split("📊 ML Insight:")[1]
                  }
                </div>
              )}

              {/* ✅ IMAGE */}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="uploaded"
                  className="chatImage"
                />
              )}

            </div>
          ))}
        </div>

        {/* ✅ INPUT */}
        <div className="inputBar">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask farming question..."
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button onClick={sendMessage}>Send</button>

          {/* ✅ IMAGE BUTTON */}
          <input
            type="file"
            onChange={(e) => handleImage(e.target.files[0])}
          />

        </div>

      </div>
    </div>
  );
}

export default ChatUI;