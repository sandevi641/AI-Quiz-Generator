import { Router } from 'express';
import healthRoutes from './health.routes.js';
import quizRoutes from './quiz.routes.js';

const apiRouter = Router();

// Mount API v1 sub-routers
apiRouter.use('/', healthRoutes);
apiRouter.use('/quizzes', quizRoutes);

export default apiRouter;
