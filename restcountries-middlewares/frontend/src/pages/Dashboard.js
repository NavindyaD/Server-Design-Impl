import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../assets/css/Dashboard.css";

const Dashboard = () => {
  const [apiInfo, setApiInfo] = useState(null);

  // Fetch API Key info on component load
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await API.get("/api/keys");
        setApiInfo(res.data);

        // Store the fetched key in localStorage (if it exists)
        if (res.data.apiKey) {
          localStorage.setItem("apiKey", res.data.apiKey);
        }
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  // Regenerate API Key
  const regenerateKey = async () => {
    try {
      const res = await API.post("/api/keys/generate");

      // Update state and store the new API key in localStorage
      setApiInfo(res.data);
      if (res.data.apiKey) {
        localStorage.setItem("apiKey", res.data.apiKey);
      }
    } catch (error) {
      console.error("Error regenerating API key:", error);
    }
  };

  // Format the 'Last Used' field to display a human-readable timestamp or 'Never' if not available
  const formatLastUsed = (lastUsedAt) => {
    if (!lastUsedAt) return "Never";
    return new Date(lastUsedAt).toLocaleString();
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {apiInfo?.apiKey ? (
        <div className="api-key-info">
          <p><strong>API Key:</strong> {apiInfo.apiKey}</p>
          <p><strong>Usage Count:</strong> {apiInfo.usageCount}</p>
          <p><strong>Last Used:</strong> {formatLastUsed(apiInfo.lastUsedAt)}</p>
          <button className="generate" onClick={regenerateKey}>
            Regenerate API Key
          </button>
        </div>
      ) : (
        <button className="generate" onClick={regenerateKey}>
          Generate New API Key
        </button>
      )}
    </div>
  );
};

export default Dashboard;
