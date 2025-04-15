import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "2rem" }}>
      <h2>API Key Management</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {apiKeyData ? (
        <div style={{ marginBottom: "1rem" }}>
          <p><strong>API Key:</strong> {apiKeyData.apiKey}</p>
          <p><strong>Usage Count:</strong> {apiKeyData.usageCount}</p>
          <p><strong>Last Used At:</strong> {apiKeyData.lastUsedAt ? new Date(apiKeyData.lastUsedAt).toLocaleString() : "N/A"}</p>
        </div>
      ) : (
        <p>No API key found.</p>
      )}

      <button onClick={generateNewApiKey} style={{ marginRight: "1rem" }}>
        Generate New API Key
      </button>
      <button onClick={deleteApiKey}>Delete API Key</button>
    </div>
  );
};

export default ApiKeyManagement;
