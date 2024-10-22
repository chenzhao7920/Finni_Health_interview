import { Router } from 'express';
import { PatientController } from '../controllers/patients.js'; // Adjust based on your actual function exports

const router = Router();

// Define your routes here
router.get('/api/v1/patients', PatientController.getPatients);
router.post('/api/v1/patients', PatientController.createPatient);
router.get('/api/v1/patients/:id', PatientController.getPatientById);
router.put('/api/v1/patients/:id', PatientController.updatePatientById);
// Export the router using ES module syntax
export default router;