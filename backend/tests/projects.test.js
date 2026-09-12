const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Project = require('../models/Project');
const User = require('../models/User');

describe('Backend Projects API Endpoints', () => {
    let adminToken;

    beforeEach(() => {
        vi.restoreAllMocks();
        adminToken = jwt.sign({ id: 'admin-123' }, process.env.JWT_SECRET);
        vi.spyOn(User, 'findById').mockReturnValue({
            select: vi.fn().mockResolvedValue({ _id: 'admin-123', role: 'admin' }),
        });
    });

    describe('GET /api/projects', () => {
        it('returns all projects list', async () => {
            const mockProjects = [
                {
                    _id: 'proj-1',
                    title: 'Luxury Villa Phase 1',
                    location: 'Hyderabad',
                    category: 'Residential',
                    status: 'ongoing',
                },
            ];

            vi.spyOn(Project, 'find').mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    populate: vi.fn().mockReturnValue({
                        populate: vi.fn().mockReturnValue({
                            populate: vi.fn().mockResolvedValue(mockProjects),
                        }),
                    }),
                }),
            });

            const res = await request(app).get('/api/projects');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('Luxury Villa Phase 1');
        });
    });

    describe('POST /api/projects', () => {
        it('creates a new project when authenticated as admin', async () => {
            const newProjectData = {
                title: 'New Commercial Tower',
                location: 'Cyberabad',
                category: 'Commercial',
                status: 'planned',
                progress: 10,
            };

            vi.spyOn(Project.prototype, 'save').mockResolvedValue({
                _id: 'proj-new-1',
                ...newProjectData,
            });

            const res = await request(app)
                .post('/api/projects')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newProjectData);

            expect(res.status).toBe(201);
            expect(res.body.title).toBe('New Commercial Tower');
        });

        it('rejects project creation with 401 when non-admin tries to create', async () => {
            const nonAdminToken = jwt.sign({ id: 'user-regular' }, process.env.JWT_SECRET);
            vi.spyOn(User, 'findById').mockReturnValue({
                select: vi.fn().mockResolvedValue({ _id: 'user-regular', role: 'user' }),
            });

            const res = await request(app)
                .post('/api/projects')
                .set('Authorization', `Bearer ${nonAdminToken}`)
                .send({ title: 'Unauthorized Project' });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Not authorized as an admin');
        });
    });
});
