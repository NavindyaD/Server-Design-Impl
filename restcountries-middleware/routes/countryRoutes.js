const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");
const { authenticateAPIKey } = require("../middleware/authMiddleware");

router.get("/:country", authenticateAPIKey, countryController.getCountryData);

module.exports = router;
