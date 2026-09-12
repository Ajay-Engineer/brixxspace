const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Contact = require('../models/Contact');
const Service = require('../models/Service');
const User = require('../models/User');

describe('Backend Services & Contacts API Endpoints', () => {
    let adminToken;

    beforeEach(() => {
        vi.restoreAllMocks();
        adminToken = jwt.sign({ id: 'admin-123' }, process.env.JWT_SECRET);
        vi.spyOn(User, 'findById').mockReturnValue({
            select: vi.fn().mockResolvedValue({ _id: 'admin-123', role: 'admin' }),
        });
    });

    describe('POST /api/contacts', () => {
        it('creates a new contact inquiry (public lead capture)', async () => {
            const contactPayload = {
                name: 'John Prospect',
                email: 'prospect@gmail.com',
                phone: '+91 9876543210',
                subject: 'Villa Construction Inquiry',
                message: 'Looking for a quotation for 4000 sqft villa.',
            };

            vi.spyOn(Contact.prototype, 'save').mockResolvedValue({
                _id: 'contact-001',
                ...contactPayload,
                status: 'new',
            });

            const res = await request(app)
                .post('/api/contacts')
                .send(contactPayload);

            expect(res.status).toBe(201);
            expect(res.body.name).toBe('John Prospect');
            expect(res.body.email).toBe('prospect@gmail.com');
        });
    });

    describe('GET /api/services', () => {
        it('returns all services list', async () => {
            const mockServices = [
                {
                    _id: 'srv-1',
                    title: 'Turnkey Construction',
                    description: 'End-to-end building solution',
                    features: ['Design', 'Permits', 'Execution'],
                },
            ];

            vi.spyOn(Service, 'find').mockReturnValue({
                sort: vi.fn().mockResolvedValue(mockServices),
                populate: vi.fn().mockReturnValue({
                    sort: vi.fn().mockResolvedValue(mockServices),
                }),
            });

            const res = await request(app).get('/api/services');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('Turnkey Construction');
        });
    });
});
