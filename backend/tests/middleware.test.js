const jwt = require('jsonwebtoken');
const { protect, admin } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorMiddleware');
const User = require('../models/User');

describe('Backend Auth & Error Middlewares', () => {
    let req, res, next;

    beforeEach(() => {
        vi.restoreAllMocks();
        req = {
            headers: {},
            cookies: {},
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
    });

    describe('protect middleware', () => {
        it('calls next() when valid Bearer authorization header is provided', async () => {
            const token = jwt.sign({ id: 'user-valid' }, process.env.JWT_SECRET);
            req.headers.authorization = `Bearer ${token}`;

            const mockUser = { _id: 'user-valid', role: 'user' };
            vi.spyOn(User, 'findById').mockReturnValue({
                select: vi.fn().mockResolvedValue(mockUser),
            });

            await protect(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toEqual(mockUser);
        });

        it('calls next() when valid jwt cookie is provided', async () => {
            const token = jwt.sign({ id: 'user-cookie' }, process.env.JWT_SECRET);
            req.cookies.jwt = token;

            const mockUser = { _id: 'user-cookie', role: 'user' };
            vi.spyOn(User, 'findById').mockReturnValue({
                select: vi.fn().mockResolvedValue(mockUser),
            });

            await protect(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toEqual(mockUser);
        });

        it('returns 401 when token verification fails or is malformed', async () => {
            req.headers.authorization = 'Bearer invalid-token';

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
            expect(next).not.toHaveBeenCalled();
        });

        it('returns 401 when no token is provided in header or cookie', async () => {
            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('admin middleware', () => {
        it('calls next() when user role is admin', () => {
            req.user = { role: 'admin' };

            admin(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('returns 401 when user role is not admin', () => {
            req.user = { role: 'user' };

            admin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized as an admin' });
            expect(next).not.toHaveBeenCalled();
        });

        it('returns 401 when req.user is undefined', () => {
            req.user = undefined;

            admin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized as an admin' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('errorHandler middleware', () => {
        it('formats error responses with status code and error message', () => {
            res.statusCode = 404;
            const err = new Error('Resource not found');

            errorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Resource not found',
            }));
        });
    });
});
