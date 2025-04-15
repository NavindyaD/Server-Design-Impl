import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/CountrySearch.css";

const CountrySearch = () => {
  const [country, setCountry] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryNames = response.data.map((c) => c.name.common).sort();
        setAllCountries(countryNames);
      } catch (err) {
        console.error("Failed to load country list", err);
      }
    };
    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCountry(value);
    setHighlightedIndex(-1);

    if (value.length > 0) {
      const filtered = allCountries.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCountry(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };

  const handleSearch = async (searchTerm = country) => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      setError("API key not found. Please generate one first.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/country?country=${searchTerm}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );
      setResult(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch country information.");
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected =
          highlightedIndex >= 0 ? suggestions[highlightedIndex] : country;
        setCountry(selected);
        setSuggestions([]);
        handleSearch(selected);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(country);
    }
  };

  return (
    <div className="country-search-container">
      <h2>Country Info</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter country name"
          value={country}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button className="generate" onClick={() => handleSearch()}>
          Search
        </button>

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => handleSuggestionClick(s)}
                className={highlightedIndex === idx ? "highlighted" : ""}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {result.length > 0 && (
        <div className="result-container">
          {result.map((item, idx) => (
            <div key={idx} className="country-card">
              <h3>{item.name}</h3>
              <p><strong>Capital:</strong> {item.capital}</p>
              <p><strong>Currency:</strong> {item.currency}</p>
              <p><strong>Languages:</strong> {item.languages}</p>
              <img src={item.flag} alt={`${item.name} flag`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySearch;
