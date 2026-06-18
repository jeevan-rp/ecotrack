const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const logRoutes = require('./routes/logs');
const insightRoutes = require('./routes/insights');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Elite Security & Efficiency Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);
app.use('/api/logs', logRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Cloud Database!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Export the Express API for Vercel
module.exports = app;

// Only listen locally if not in Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}
