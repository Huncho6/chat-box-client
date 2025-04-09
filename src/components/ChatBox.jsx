import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // Retrieve the token from localStorage
const socket = io("http://localhost:3000", {
  auth: {
    token, // Send the token during the connection handshake
  },
});

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState(""); // Selected recipient
  const [users, setUsers] = useState([]); // List of all users
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering users

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        console.log("Fetched users:", response.data); // Debugging
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    // Listen for new messages via Socket.IO
    socket.on("private message", (msg) => {
      console.log("Received private message:", msg); // Debugging
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("private message");
    };
  }, []);

  const searchUser = () => {
    console.log("Search query:", searchQuery); // Debugging
    console.log("Users array:", users); // Debugging

    // Get the currently logged-in user's information from localStorage or token
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // Assuming user info is stored in localStorage

    // Check if the search query matches the logged-in user's username or email
    if (
      searchQuery.toLowerCase() === loggedInUser.username.toLowerCase() ||
      searchQuery.toLowerCase() === loggedInUser.email.toLowerCase()
    ) {
      alert("You cannot chat with yourself!");
      return;
    }

    // Find the user in the users array
    const foundUser = users.find(
      (user) =>
        user.username.toLowerCase() === searchQuery.toLowerCase() ||
        user.email.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundUser) {
      setRecipient(foundUser.username);
      alert(`Chatting with ${foundUser.username}`);
    } else {
      alert("User not found");
    }
  };

  const sendMessage = async () => {
    if (!recipient) {
      alert("Please select a recipient first by searching for a user or clicking on a message.");
      return;
    }

    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    try {
      // Emit the message to the server
      socket.emit("private message", { recipient, content: message });

      // Add the message to the local chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", content: message }, // Add the sent message to the chat
      ]);
      setMessage(""); // Clear the message input
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  };

  const handleReply = (sender) => {
    setRecipient(sender); // Set the sender as the recipient
    alert(`Replying to ${sender}`);
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <label>Search for a user:</label>
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchUser}>Search</button>
      </div>
      <div>
        <h3>Chatting with: {recipient || "No recipient selected"}</h3>
      </div>
      <div>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p
              key={index}
              onClick={() => handleReply(msg.sender)} // Set the sender as the recipient when clicked
              style={{ cursor: "pointer", color: msg.sender === "You" ? "blue" : "black" }}
            >
              {msg.sender}: {msg.content}
            </p>
          ))
        ) : (
          <p>No messages yet</p>
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