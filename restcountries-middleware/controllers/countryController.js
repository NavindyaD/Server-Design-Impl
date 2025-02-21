const axios = require("axios");

exports.getCountryData = async (req, res) => {
  try {
    const { country } = req.params;
    const response = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
    const { name, currencies, capital, languages, flags } = response.data[0];

    res.json({ name, currencies, capital, languages, flag: flags.png });
  } catch (error) {
    res.status(500).json({ error: "Error fetching country data" });
  }
};
