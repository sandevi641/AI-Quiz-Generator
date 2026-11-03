import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`[Backend] Server listening on port ${env.PORT}`);
  console.log(`[Backend] Environment: ${env.NODE_ENV}`);
  console.log(`[Backend] Health check: http://localhost:${env.PORT}/api/v1/health`);
});

const handleShutdown = (signal: string) => {
  console.log(`[Backend] Received ${signal}. Gracefully shutting down...`);
  server.close(() => {
    console.log('[Backend] Closed remaining connections.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default server;

