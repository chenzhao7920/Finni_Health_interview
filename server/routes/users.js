import { Router } from 'express';
import { UserController } from '../controllers/users.js'; // Adjust based on your actual function exports

const router = Router();

// Define your routes here
router.get('/api/v1/users', UserController.getUsers);
router.post('/api/v1/users', UserController.createUser);

// Export the router using ES module syntax
export default router;