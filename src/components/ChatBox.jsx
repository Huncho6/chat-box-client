import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import UserList from "./UserList";
import axios from "axios";

const token = localStorage.getItem("token");
const socket = io("http://localhost:3000", {
  auth: {
    token,
  },
});

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  // Listen for incoming private messages
  useEffect(() => {
    socket.on("private message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("private message");
    };
  }, []);

  // Fetch messages for the selected recipient
  useEffect(() => {
    const fetchMessages = async () => {
      if (!recipient) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/chat/private/${recipient}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );

        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        alert("Failed to fetch messages.");
      }
    };

    fetchMessages();
  }, [recipient]);

  // Send a new message
  const sendMessage = async () => {
    if (!recipient) {
      alert("Please select a recipient first.");
      return;
    }

    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    try {
      const newMessage = {
        recipient, // Send the recipient's username
        content: message,
      };

      const response = await axios.post(
        "http://localhost:3000/api/v1/chat/private",
        newMessage,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      // Emit the message to the Socket.IO server
      socket.emit("private message", response.data.data);

      // Update the local message list
      setMessages((prevMessages) => [...prevMessages, response.data.data]);
      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <UserList onSelectUser={setRecipient} />
      {recipient && (
        <div className="mt-4 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">
            Chatting with:{" "}
            <span className="text-blue-500">{recipient}</span>
          </h3>
          <div className="bg-white shadow-md rounded-lg p-4 h-64 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <p key={index} className="mb-2">
                  <span className="font-bold">
                    {msg.sender.username || "Unknown"}:
                  </span>{" "}
                  {msg.content}
                  <br />
                  <span className="text-gray-500 text-sm">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </p>
              ))
            ) : (
              <p className="text-gray-500">No messages yet</p>
            )}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;