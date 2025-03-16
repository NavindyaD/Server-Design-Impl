const express = require("express");
const { getCountryInfo } = require("../controllers/countryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/country", authMiddleware, getCountryInfo);

module.exports = router;
