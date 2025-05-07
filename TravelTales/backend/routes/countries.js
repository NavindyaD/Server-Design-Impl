const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { name: "Japan", capital: "Tokyo", currency: "Yen", flag: "🇯🇵" },
    { name: "Sri Lanka", capital: "Colombo", currency: "Rupee", flag: "🇱🇰" }
   
  ]);
});

module.exports = router;
