import { Router } from 'express';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

// Mount API v1 sub-routers
apiRouter.use('/', healthRoutes);

export default apiRouter;

