import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("https://chat-box-server-rgpe.onrender.com/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const filteredUsers = response.data.filter(
          (user) => user.username !== loggedInUser.username
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Users</h3>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user.username)} // Pass the username to the parent
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;