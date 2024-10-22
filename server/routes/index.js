import { Router } from 'express';
import patientRoutes from './patients.js'
import userRoutes from './users.js'
const router = Router();

// Use the API router
router.use(patientRoutes);
router.use(userRoutes);

export default router;
