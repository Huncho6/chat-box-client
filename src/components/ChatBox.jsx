import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Adjust the URL as needed

const ChatBox = () => {
  const [messages, setMessages] = useState([]); // Initialize as an empty array
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch chat messages from the API
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/chat/messages"
        );
        setMessages(response.data.messages || []); // Ensure messages is an array
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for new messages via Socket.IO
    socket.on("chat message", (msg) => {
      console.log("New message received:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/chat/messages", {
        sender: "test-user",
        content: message,
      }); // Use full backend URL
      socket.emit("chat message", { sender: "test-user", content: message }); // Emit the message object
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.length > 0 ? (
          messages.map((msg, index) => <p key={index}>{msg.content}</p>)
        ) : (
          <p>No messages yet</p> // Handle empty messages gracefully
        )}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
