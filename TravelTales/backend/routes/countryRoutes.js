const express = require('express');
const router = express.Router();
const Country = require('../models');

router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.status(200).json(countries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
