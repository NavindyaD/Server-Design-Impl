const express = require("express");
const { getCountryInfo } = require("../controllers/countryController");

const router = express.Router();
router.get("/country", getCountryInfo);

module.exports = router;
