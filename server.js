// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./src/routes/auth');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

// Routes - authRoutes MUST be an express Router (see src/routes/auth.js below)
app.use('/api/auth', authRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

// Only connect DB and start server when NOT testing
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log('Database connected');
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => console.log(`Server running on :${PORT}`));
    })
    .catch((err) => {
      console.error('DB connection error:', err);
      process.exit(1);
    });
} else {
  // In test env, don't auto connect (tests will connect/disconnect)
  console.log('Running in test mode — skipping DB connect and app.listen');
}

module.exports = app;
