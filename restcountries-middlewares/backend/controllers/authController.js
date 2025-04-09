const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const apiKey = Math.random().toString(36).substring(2, 15);
    
    const user = await User.create({ username, password: hashedPassword, apiKey });
    res.json({ message: "User registered", apiKey: user.apiKey });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Increment the usage count on successful login
    user.usageCount += 1;
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, apiKey: user.apiKey, usageCount: user.usageCount });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
