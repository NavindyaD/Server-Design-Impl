import React, { useState } from "react";
import axios from "axios";

const CountrySearch = () => {
  const [country, setCountry] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:5000/api/country?country=${country}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      setData({ error: "Failed to fetch country info" });
    }
  };

  return (
    <div>
      <h2>Search Country</h2>
      <input
        type="text"
        placeholder="Enter country name"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {data?.error && <p>{data.error}</p>}
      {data && Array.isArray(data) && data.map((item, index) => (
        <div key={index}>
          <h3>{item.name}</h3>
          <p>Capital: {item.capital}</p>
          <p>Currency: {item.currency}</p>
          <p>Languages: {item.languages.join(", ")}</p>
          <img src={item.flag} alt="flag" width="100" />
        </div>
      ))}
    </div>
  );
};

export default CountrySearch;
