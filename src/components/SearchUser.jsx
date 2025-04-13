import React, { useState } from "react";
import axios from "axios";

const SearchUser = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage

    try {
      const response = await axios.get(`https://chat-box-server-rgpe.onrender.com/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = response.data;

      // Find the user in the users array
      const foundUser = users.find(
        (user) =>
          user.username.toLowerCase() === searchQuery.toLowerCase() ||
          user.email.toLowerCase() === searchQuery.toLowerCase()
      );

      if (foundUser) {
        setError("");
        onUserSelect(foundUser.username); // Pass the selected user to the parent component
      } else {
        setError("User not found");
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      setError("Failed to search for user. Please try again.");
    }
  };

  return (
    <div>
      <label>Search for a user:</label>
      <input
        type="text"
        placeholder="Search by username or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SearchUser;