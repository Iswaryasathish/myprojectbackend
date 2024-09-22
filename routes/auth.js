const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Hardcoded credentials for simplicity
const ADMIN_EMAIL = 'iswarya123@gmail.com';
const ADMIN_PASSWORD = 'iswarya@123';
const EMPLOYEE_EMAIL = 'employee123@gmail.com';
const EMPLOYEE_PASSWORD = 'employee@123';

// Register Route (for initial setup)
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    // Verify credentials and role
    let validUser = false;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD && role === 'admin') {
        validUser = true;
    }
    if (email === EMPLOYEE_EMAIL && password === EMPLOYEE_PASSWORD && role === 'employee') {
        validUser = true;
    }

    if (validUser) {
        const token = jwt.sign({ role }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.json({ token, role });
    }

    res.status(400).json({ message: 'Invalid credentials' });
});

module.exports = router;




