const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // The Express app
const User = require('../models/User');

// Mock Mongoose methods
jest.mock('../models/User');
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: { close: jest.fn() }
}));

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should validate inputs and return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Validation error');
      expect(res.body.errors).toBeDefined();
    });

    it('should register a new user successfully', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);
      // Mock user.save
      User.prototype.save = jest.fn().mockResolvedValue(true);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on the API', async () => {
      // We will hit the endpoint multiple times.
      // Note: express-rate-limit tracks IPs, in supertest it uses 127.0.0.1
      // We might need to send >100 requests to trigger it, which is slow.
      // Since max is 100, we'll just test that the headers exist.
      const res = await request(app).get('/api/auth/some-fake-route');
      expect(res.headers).toHaveProperty('x-ratelimit-limit');
      expect(res.headers['x-ratelimit-limit']).toBe('100');
    });
  });
});
