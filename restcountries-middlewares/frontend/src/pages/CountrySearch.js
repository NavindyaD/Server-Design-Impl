import React, { useState } from "react";
import axios from "axios";

const CountrySearch = () => {
  const [country, setCountry] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      setError("API key not found. Please generate one first.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/country?country=${country}`, {
        headers: {
          "x-api-key": apiKey
        }
      });
      setResult(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch country information.");
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Country Info</h2>
      <input
        type="text"
        placeholder="Enter country name"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {result.map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <h3>{item.name}</h3>
              <p><strong>Capital:</strong> {item.capital}</p>
              <p><strong>Currency:</strong> {item.currency}</p>
              <p><strong>Languages:</strong> {item.languages}</p>
              <img src={item.flag} alt="Flag" style={{ width: "100px" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySearch;
