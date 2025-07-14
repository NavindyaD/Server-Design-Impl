import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/ApiKeyManagement.css"; 

// Main Component for API Key Management
const ApiKeyManagement = () => {
  const [apiKeyData, setApiKeyData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch API key info on load
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/keys", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApiKeyData(res.data);

        // Save current key for later usage
        localStorage.setItem("apiKey", res.data.apiKey);
      } catch (err) {
        setError("Failed to fetch API key");
      }
    };

    fetchApiKey();
  }, [token]);

  // Generate new API key
  const generateNewApiKey = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/keys/generate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newKey = res.data.apiKey;

      setApiKeyData({ apiKey: newKey, usageCount: 0, lastUsedAt: null });
      localStorage.setItem("apiKey", newKey);
      setMessage("New API key generated.");
      setError("");
    } catch (err) {
      setError("Failed to generate API key");
      setMessage("");
    }
  };

  // Delete the API key
  const deleteApiKey = async () => {
    try {
      await axios.delete("http://localhost:5000/api/keys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApiKeyData(null);
      localStorage.removeItem("apiKey");
      setMessage("API key deleted.");
      setError("");
    } catch (err) {
      setError("Failed to delete API key");
      setMessage("");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>API Key Management</h2>

      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="api-key-info">
        {apiKeyData ? (
          <>
            <p><strong>API Key:</strong> {apiKeyData.apiKey}</p>
            <p><strong>Usage Count:</strong> {apiKeyData.usageCount}</p>
            <p><strong>Last Used At:</strong> {apiKeyData.lastUsedAt ? new Date(apiKeyData.lastUsedAt).toLocaleString() : "N/A"}</p>
          </>
        ) : (
          <p>No API key found.</p>
        )}
      </div>

      <div className="button-container">
        <button onClick={generateNewApiKey} className="generate">
          Generate New API Key
        </button>
        <button onClick={deleteApiKey} className="generate">
          Delete API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyManagement;
