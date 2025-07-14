import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/CountryInfo.css';

const CountryInfo = () => {
  const [country, setCountry] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');

  const fetchCountryInfo = async () => {
    setError('');
    try {
      const res = await axios.get(`http://localhost:3001/api/country?country=${country}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="country-info">
      <h2>Country Info</h2>
      <input
        type="text"
        placeholder="Your API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter country name"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button onClick={fetchCountryInfo}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {result.map((info, idx) => (
          <li key={idx}>
            <h3>{info.name}</h3>
            <p>Capital: {info.capital}</p>
            <p>Currency: {info.currency}</p>
            <p>Languages: {info.languages}</p>
            <img src={info.flag} alt="Flag" width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryInfo;
