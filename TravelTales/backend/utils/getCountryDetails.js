// utils/getCountryDetails.js
const axios = require('axios');

const getCountryDetails = async (countryName) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
    const country = response.data[0];
    return {
      flag: country.flags?.png || '',
      currency: Object.values(country.currencies || {})[0]?.name || '',
      capital: country.capital?.[0] || ''
    };
  } catch (error) {
    console.error('Error fetching country details:', error.message);
    return { flag: '', currency: '', capital: '' };
  }
};

module.exports = getCountryDetails;
