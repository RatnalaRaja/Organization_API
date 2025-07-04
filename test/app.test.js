const request = require('supertest');
const app = require('../app');
const Organization = require('../models/organization');
jest.mock('../models/organization');

const protect = require('../middleware/auth');
jest.mock('../middleware/auth', () => jest.fn((req, res, next) => next()));

describe('Organization API Routes', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/org', () => {
    it('should return all organizations', async () => {
      const mockOrgs = [{ org_id: '1', org_name: 'TestOrg' }];
      Organization.findAll.mockResolvedValue(mockOrgs);

      const res = await request(app).get('/api/org');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrgs);
      expect(Organization.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      Organization.findAll.mockRejectedValue(new Error('DB Error'));

      const res = await request(app).get('/api/org');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/org', () => {
    it('should create an organization and return it', async () => {
      const newOrg = { org_id: '2', org_name: 'NewOrg' };
      Organization.create.mockResolvedValue(newOrg);

      const res = await request(app).post('/api/org').send(newOrg);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Org Created Successfully');
      expect(res.body).toHaveProperty('org');
      expect(Organization.create).toHaveBeenCalledWith(newOrg);
    });

    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/org').send({ org_name: 'MissingId' });
      expect(res.status).toBe(400);
      expect(res.body).toBe("All fields are required");
    });

    it('should handle creation error', async () => {
      Organization.create.mockRejectedValue(new Error('Insert failed'));

      const res = await request(app).post('/api/org').send({ org_id: '2', org_name: 'ErrOrg' });
      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/org/:id', () => {
    it('should update an existing organization', async () => {
      const mockOrg = { update: jest.fn(), org_id: '3', org_name: 'Old' };
      Organization.findByPk.mockResolvedValue(mockOrg);
      mockOrg.update.mockResolvedValue({ org_id: '3', org_name: 'Updated' });

      const res = await request(app).put('/api/org/3').send({ org_name: 'Updated' });

      expect(res.status).toBe(200);
      expect(mockOrg.update).toHaveBeenCalledWith({ org_name: 'Updated' });
    });

    it('should return 404 if org not found', async () => {
      Organization.findByPk.mockResolvedValue(null);
      const res = await request(app).put('/api/org/999').send({ org_name: 'Nothing' });

      expect(res.status).toBe(404);
      expect(res.body).toBe("Organization not found");
    });
  });

  describe('DELETE /api/org/:id', () => {
    it('should delete the organization', async () => {
      const mockOrg = { destroy: jest.fn() };
      Organization.findByPk.mockResolvedValue(mockOrg);

      const res = await request(app).delete('/api/org/4');

      expect(res.status).toBe(204);
      expect(mockOrg.destroy).toHaveBeenCalled();
    });

    it('should return 404 if not found', async () => {
      Organization.findByPk.mockResolvedValue(null);

      const res = await request(app).delete('/api/org/999');
      expect(res.status).toBe(404);
      expect(res.body).toBe("Organization Not found");
    });

    it('should handle server error', async () => {
      Organization.findByPk.mockRejectedValue(new Error('DB fail'));

      const res = await request(app).delete('/api/org/5');
      expect(res.status).toBe(500);
      expect(res.body).toBe("Server Error");
    });
  });

});
