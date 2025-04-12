import React, { useState, useEffect } from "react";
import axios from "axios";

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [error, setError] = useState(null);
  const [newApiKey, setNewApiKey] = useState("");

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/keys", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setApiKeys(response.data);
    } catch (err) {
      setError("Failed to fetch API keys.");
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/keys",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewApiKey(response.data.apiKey);
      fetchApiKeys(); // Refresh API keys
    } catch (err) {
      setError("Failed to create API key.");
    }
  };

  const handleDeleteApiKey = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/keys/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchApiKeys(); // Refresh API keys
    } catch (err) {
      setError("Failed to delete API key.");
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div>
      <h2>API Key Management</h2>
      {error && <p>{error}</p>}
      <button onClick={handleCreateApiKey}>Create API Key</button>
      {newApiKey && <p>New API Key: {newApiKey}</p>}
      <ul>
        {apiKeys.map((key) => (
          <li key={key.id}>
            {key.apiKey}{" "}
            <button onClick={() => handleDeleteApiKey(key.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiKeyManagement;
