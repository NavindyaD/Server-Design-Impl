import React, { useEffect, useState } from "react";
import API from "../api/axios"; // Axios instance to handle API requests

const Dashboard = () => {
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // Fetch API key data from the backend endpoint
        const res = await API.get("/api/keys"); // This is the updated backend URL
        setApiInfo(res.data); // Store API key info in state
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  const regenerateKey = async () => {
    try {
      const res = await API.post("/api/keys/generate"); // Endpoint to generate new API key
      setApiInfo(res.data);
    } catch (error) {
      console.error("Error regenerating API key:", error);
    }
  };

  const deleteKey = async () => {
    try {
      await API.delete("/api/keys/delete"); // Endpoint to delete API key
      setApiInfo(null); // Clear API key data from state
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {apiInfo?.apiKey ? (
        <>
          <p><strong>API Key:</strong> {apiInfo.apiKey}</p>
          <p><strong>Usage Count:</strong> {apiInfo.usageCount}</p>
          <p><strong>Last Used:</strong> {apiInfo.lastUsedAt}</p>
          <button onClick={regenerateKey}>Regenerate</button>
          <button onClick={deleteKey}>Delete</button>
        </>
      ) : (
        <button onClick={regenerateKey}>Generate New API Key</button>
      )}
    </div>
  );
};

export default Dashboard;
