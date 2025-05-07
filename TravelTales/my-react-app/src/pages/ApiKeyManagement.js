import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/ApiKeyManagement.css";

const ApiKeyManagement = () => {
  const [apiKeyData, setApiKeyData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/keys", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApiKeyData(res.data);
        localStorage.setItem("apiKey", res.data.apiKey);
      } catch (err) {
        setError("Failed to fetch API key");
      }
    };
    fetchApiKey();
  }, [token]);

  const generateNewApiKey = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/keys/generate",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiKeyData({ apiKey: res.data.apiKey, usageCount: 0, lastUsedAt: null });
      localStorage.setItem("apiKey", res.data.apiKey);
      setMessage("New API key generated.");
      setError("");
    } catch (err) {
      setError("Failed to generate API key");
    }
  };

  const deleteApiKey = async () => {
    try {
      await axios.delete("http://localhost:5000/api/keys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApiKeyData(null);
      localStorage.removeItem("apiKey");
      setMessage("API key deleted.");
      setError("");
    } catch (err) {
      setError("Failed to delete API key");
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
