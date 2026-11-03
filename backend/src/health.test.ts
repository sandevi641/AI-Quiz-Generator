import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

describe('Backend API Integration Tests', () => {
  const app = createApp();

  describe('GET /api/v1/health', () => {
    it('should return HTTP 200 with status "ok" and expected message', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty(
        'message',
        'AI Quiz Generator backend is running'
      );
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('CORS Origin Verification', () => {
    it('should include CORS allow headers for configured client origin', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:5173'
      );
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject requests with disallowed origin via CORS', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://unauthorized-domain.com');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body.message).toContain('not allowed by CORS');
    });
  });

  describe('404 Not Found Handler', () => {
    it('should return HTTP 404 with structured JSON for unknown routes', async () => {
      const response = await request(app).get('/api/v1/non-existent-endpoint');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Cannot GET /api/v1/non-existent-endpoint - Route not found',
      });
    });
  });

  describe('Root Info Endpoint', () => {
    it('GET / should return API metadata and link to health check', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'AI Quiz Generator API');
      expect(response.body).toHaveProperty('status', 'active');
      expect(response.body).toHaveProperty('healthCheck', '/api/v1/health');
    });
  });
});
