const axios = require("axios");
const User = require("../models/User");

exports.getCountryInfo = async (req, res) => {
  const apiKey = req.header("x-api-key");
  const { country } = req.query;

  if (!apiKey) return res.status(403).json({ error: "API key required" });
  if (!country) return res.status(400).json({ error: "Country query parameter is required" });

  const user = await User.findOne({ where: { apiKey } });
  if (!user) return res.status(403).json({ error: "Invalid API key" });

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
    
    const filtered = response.data.map(({ name, currencies, capital, languages, flags }) => {
      const languageList = languages ? Object.values(languages) : [];  // Ensure it's an array
      return {
        name: name.common,
        currency: currencies ? Object.values(currencies)[0].name : "N/A",
        capital: capital ? capital[0] : "N/A",
        languages: languageList.length > 0 ? languageList.join(", ") : "N/A",  // Safely join languages
        flag: flags.png
      };
    });

    // Track usage
    user.usageCount += 1;
    user.lastUsedAt = new Date();
    await user.save();

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Country not found or external API error" });
  }
};
