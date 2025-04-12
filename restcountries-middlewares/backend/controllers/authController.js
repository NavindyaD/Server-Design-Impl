const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import your User model

// Register function
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    // Generate a JWT token for the new user
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return the response with the token and usage count
    res.status(201).json({
      message: "User registered successfully",
      token,
      usageCount: newUser.usageCount, // Include the usageCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong during registration" });
  }
};

const crypto = require("crypto");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate API key if not already present
    if (!user.apiKey) {
      user.apiKey = crypto.randomBytes(8).toString("hex"); // Generates a 16-character API key
    }

    // Increment usage count and save
    user.usageCount += 1;
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      userId: user.id,
      apiKey: user.apiKey,           // Include the API key in response
      usageCount: user.usageCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};
