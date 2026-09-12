process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_12345';
process.env.PORT = '5099';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/brixxspace_test';

// Mock nodemailer email transport to avoid actual network SMTP calls during tests
vi.mock('../utils/email', () => ({
    sendEmail: vi.fn().mockResolvedValue({ messageId: 'mock-email-id' }),
}));

beforeEach(() => {
    vi.clearAllMocks();
});
