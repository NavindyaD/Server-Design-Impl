const axios = require("axios");

exports.getCountryInfo = async (req, res) => {
  try {
    const { country } = req.query;
    const response = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
    
    const filteredData = response.data.map(({ name, currencies, capital, languages, flags }) => ({
      name: name.common,
      currency: currencies ? Object.values(currencies)[0].name : "N/A",
      capital: capital ? capital[0] : "N/A",
      languages: languages ? Object.values(languages) : "N/A",
      flag: flags.png
    }));

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "Country not found" });
  }
};
