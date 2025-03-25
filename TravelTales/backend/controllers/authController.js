const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = (req, res) => {
    const { email, password } = req.body;
    User.createUser(email, password, (err, userId) => {
        if (err) return res.status(500).json({ error: 'Registration failed' });
        res.status(201).json({ message: 'User created successfully' });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;
    User.findUserByEmail(email, (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'User not found' });
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return res.status(400).json({ error: 'Invalid credentials' });
            const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        });
    });
};

module.exports = { register, login };
