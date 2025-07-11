require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET;

    // Normalize email to lowercase for consistent comparison
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    console.log('Stored password hash:', user.password);

    // Compare the password (using bcrypt)
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password match:', validPassword); 

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate token if password is valid
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Include user data in the response alongside the token
    return res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
