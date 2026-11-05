import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

describe('Backend API & Security Integration Tests', () => {
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

  describe('Security Headers (Helmet)', () => {
    it('should include standard HTTP security headers on responses', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['cross-origin-resource-policy']).toBe('cross-origin');
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

  describe('Reusable Zod Request Validation (validateRequest)', () => {
    it('should permit valid payload and return HTTP 200', async () => {
      const response = await request(app)
        .post('/api/v1/validate-demo')
        .send({
          title: 'Cellular Respiration Quiz',
          numQuestions: 10,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body.data).toEqual({
        title: 'Cellular Respiration Quiz',
        numQuestions: 10,
      });
    });

    it('should reject invalid payload with HTTP 400 and field-level error messages', async () => {
      const response = await request(app)
        .post('/api/v1/validate-demo')
        .send({
          title: 'AB', // too short (< 3)
          numQuestions: 99, // exceeds max (20)
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBe(2);

      const fields = response.body.errors.map((e: { field: string }) => e.field);
      expect(fields).toContain('title');
      expect(fields).toContain('numQuestions');
    });
  });

  describe('Malformed JSON Handling', () => {
    it('should reject malformed JSON with HTTP 400 Bad Request', async () => {
      const response = await request(app)
        .post('/api/v1/validate-demo')
        .set('Content-Type', 'application/json')
        .send('{"invalidJson": unquotedString}');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body.message).toBe(
        'Invalid JSON payload received in request body'
      );
    });
  });

  describe('Rate Limiting Protection', () => {
    it('should trigger HTTP 429 when request threshold is exceeded', async () => {
      // Create a test instance with max 2 requests
      const rateLimitedApp = createApp({ rateLimitMax: 2, rateLimitWindowMs: 60000 });

      const res1 = await request(rateLimitedApp).get('/api/v1/health');
      expect(res1.status).toBe(200);

      const res2 = await request(rateLimitedApp).get('/api/v1/health');
      expect(res2.status).toBe(200);

      const res3 = await request(rateLimitedApp).get('/api/v1/health');
      expect(res3.status).toBe(429);
      expect(res3.body).toHaveProperty('status', 'error');
      expect(res3.body.message).toContain('Too many requests');
    });
  });

  describe('404 Not Found Handler', () => {
    it('should return HTTP 404 with structured JSON for unknown routes', async () => {
      const response = await request(app).get('/api/v1/non-existent-endpoint');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
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
