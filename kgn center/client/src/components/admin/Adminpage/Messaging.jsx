import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Adminpage.css";

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    axios.get("/api/messages")
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, []);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const res = await axios.post("/api/messages/send", { text: newMsg });
    setMessages([res.data, ...messages]);
    setNewMsg("");
  };

  return (
    <div className="admin-page-container">
      <h1>Messaging</h1>
      <div className="msg-container">
        <div className="msg-input">
          <textarea
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Write announcement or message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <ul className="msg-list">
          {messages.map((msg) => (
            <li key={msg.id}>
              <strong>{msg.sender}</strong>: {msg.text}
              <span>{new Date(msg.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Messaging;
