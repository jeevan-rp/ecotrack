const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { z } = require('zod');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const RegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

/**
 * @desc    Register a user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT payload
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 }, // Expires in a long time for dev
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            pfp: user.pfp
          }
        });
      }
    );
  } catch (err) {
    console.error('Register error:', err);
    if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            pfp: user.pfp
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};
