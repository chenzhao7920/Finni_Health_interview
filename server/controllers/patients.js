// Import PrismaClient from @prisma/client
import { PrismaClient,Prisma} from '@prisma/client';
// Create a new instance of PrismaClient
const prisma = new PrismaClient();

// Define the PatientController object with methods
export const PatientController = {
  createPatient: async (req, res) => {
    const { first_name, middle_name, last_name, date_of_birth, status, custom_fields } = req.body;
    try {
      const newPatient = await prisma.patients.create({
        data: {
          first_name,
          middle_name,
          last_name,
          date_of_birth,
          status,
          custom_fields,
        },
      });
      res.status(201).json(newPatient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create patient' });
    }
  },

  getPatients: async (req, res) => {
    try {
      const { search } = req.query;
      const searchTerms = search ? search.split(',') : [];
      const whereClauses = searchTerms.length ?
      `where` + searchTerms.map((term) => `
        (
          first_name ILIKE '%' || '${term}' || '%' OR
          last_name ILIKE '%' || '${term}' || '%' OR
          date_of_birth::text ILIKE '%' || '${term}' || '%' OR
          street ILIKE '%' || '${term}'|| '%' OR
          city ILIKE '%' || '${term}' || '%'
        )`
      ).join(' AND '): ""

      const result = await prisma.$queryRaw`
           SELECT * FROM patient_addresses
           LEFT JOIN patients
           ON patients.id = patient_addresses.patient_id
           AND patient_addresses.is_primary_address = true
           ${Prisma.raw(whereClauses)}
      `

      res.json(result);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to retrieve patients' });
    }
  },

  getPatientById: async (req, res) => {
    const { id } = req.params;
    try {
      const patient = await prisma.patients.findUnique({ // Use findUnique instead of get
        where: { id: Number(id) },
        include: {
          patient_addresses: true
        }
      });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve patient' });
    }
  },

  updatePatientById: async (req, res) => { // Changed to lowercase 'u' for consistency
    const { id } = req.params;
    const { first_name, middle_name, last_name, date_of_birth, status, custom_fields } = req.body;
    try {
      const updatedPatient = await prisma.patients.update({
        where: { id: Number(id) },
        data: {
          first_name,
          middle_name,
          last_name,
          date_of_birth,
          status,
          custom_fields,
        },
      });
      res.json(updatedPatient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update patient' }); // Changed error message for clarity
    }
  },
};


