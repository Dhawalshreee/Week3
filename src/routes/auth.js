// src/routes/auth.js
const express = require('express');
const router = express.Router();

// Example minimal in-memory user store for tests (replace with Mongoose model in real app)
const users = [];

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // check duplicate email
    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // create user (in real app use Mongoose + hashing)
    const id = users.length + 1;
    const newUser = { id, name, username, email };
    users.push(newUser);

    return res.status(201).json({ id, name, username, email });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
