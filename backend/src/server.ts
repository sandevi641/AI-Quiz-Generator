import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server successfully started and listening on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`CORS allowed origin: ${env.CLIENT_URL}`);
  logger.info(`Health check available at: http://localhost:${env.PORT}/api/v1/health`);
});

// Manage startup / runtime server socket errors (e.g. port already in use)
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${env.PORT} is already in use by another process.`);
    logger.error('Please terminate the occupying process or set a different PORT in .env.');
  } else {
    logger.error(`Server failed to start due to error: ${error.message}`);
  }
  process.exit(1);
});

// Graceful shutdown handler
const handleShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Gracefully closing HTTP server...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force close if graceful shutdown takes longer than 10 seconds
  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcefully terminating process.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Handle unexpected unhandled rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection detected:', reason);
});

// Handle unexpected uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception detected:', error);
  process.exit(1);
});

export default server;
