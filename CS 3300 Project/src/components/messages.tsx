import React, { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../utils/api";

type Message = {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  timestamp: string;
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipientId, setRecipientId] = useState<number | "">("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages on mount
  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async () => {
    if (!recipientId || !content.trim()) {
      alert("Please provide recipient ID and message content.");
      return;
    }
    try {
      await sendMessage(Number(recipientId), content.trim());
      setContent("");
      setRecipientId("");
      loadMessages();
    } catch {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="messaging-component" style={{ maxWidth: 600, margin: "auto" }}>
      <h3>Messages</h3>

      {loading && <p>Loading messages...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: 6,
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length === 0 && <p>No messages.</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>From ID: {msg.sender_id}</strong>
            <p style={{ margin: "4px 0" }}>{msg.content}</p>
            <small style={{ color: "#666" }}>
              {new Date(msg.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          placeholder="Recipient User ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value === "" ? "" : Number(e.target.value))}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="Type your message here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 8, resize: "vertical" }}
        />
      </div>

      <button onClick={handleSend} style={{ padding: "10px 20px" }}>
        Send Message
      </button>
    </div>
  );
};

export default Messages;
