import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const token = localStorage.getItem("token");
const socket = io("https://chat-box-server-rgpe.onrender.com", {
  auth: {
    token,
  },
});

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for incoming private messages
    socket.on("private message", (msg) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          sender: msg.sender.username || "Unknown",
          content: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleString(),
        },
      ]);
    });

    return () => {
      socket.off("private message");
    };
  }, []);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (notifications.length > 0) {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [notifications]);

  return (
    <div className="fixed top-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">Notifications</h3>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="mb-2 border-b pb-2">
              <p className="font-bold">{notification.sender}:</p>
              <p>{notification.content}</p>
              <p className="text-gray-500 text-sm">{notification.timestamp}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No new notifications</p>
      )}
    </div>
  );
};

export default Notification;