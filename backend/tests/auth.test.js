const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

describe('Backend Auth & Health API Endpoints', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('GET /', () => {
        it('returns health check status 200 with running message', async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(res.text).toContain('API is running...');
        });
    });

    describe('POST /api/auth/login', () => {
        it('logs in successfully and returns JWT token and user profile', async () => {
            const mockUser = {
                _id: 'user-12345',
                fullName: 'Test User',
                email: 'test@brixxspace.com',
                role: 'admin',
                avatarUrl: 'https://example.com/avatar.jpg',
                matchPassword: vi.fn().mockResolvedValue(true),
            };

            vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@brixxspace.com',
                    password: 'correct-password',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.email).toBe('test@brixxspace.com');
            expect(res.body.role).toBe('admin');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('rejects login with 401 on incorrect password', async () => {
            const mockUser = {
                _id: 'user-12345',
                email: 'test@brixxspace.com',
                matchPassword: vi.fn().mockResolvedValue(false),
            };

            vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@brixxspace.com',
                    password: 'wrong-password',
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Invalid email or password');
        });

        it('rejects login with 401 when user does not exist', async () => {
            vi.spyOn(User, 'findOne').mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@brixxspace.com',
                    password: 'somepassword',
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Invalid email or password');
        });
    });

    describe('GET /api/auth/me', () => {
        it('returns authenticated user profile when valid Bearer token provided', async () => {
            const token = jwt.sign({ id: 'user-12345' }, process.env.JWT_SECRET);
            const mockUser = {
                _id: 'user-12345',
                fullName: 'Authenticated User',
                email: 'auth@brixxspace.com',
                role: 'user',
            };

            vi.spyOn(User, 'findById').mockImplementation(() => {
                const queryObj = Promise.resolve(mockUser);
                queryObj.select = vi.fn().mockResolvedValue(mockUser);
                return queryObj;
            });

            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.email).toBe('auth@brixxspace.com');
        });

        it('rejects unauthorized request with 401 when no token is supplied', async () => {
            const res = await request(app).get('/api/auth/me');
            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Not authorized');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('clears the jwt cookie and returns successful message', async () => {
            const res = await request(app).post('/api/auth/logout');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Logged out successfully');
        });
    });
});
