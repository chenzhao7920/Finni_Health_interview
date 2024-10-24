import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserController = {
  // Create a new user
  createUser: async (req, res) => {
    const { email, uid } = req.body;
    try {

      const newUser = await prisma.users.create({
        data: {
          email,
          uid,
          created_at: new Date(),
          updated_at: new Date()
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.log(error)
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  // Get all users
  getUsers: async (req, res) => {
    try {
      const { email, uid } = req.query;
      // If email is provided, add it to the filter
      const filter = {};
      if (email) {
        filter.email = email;
      }
      // If uid is provided, add it to the filter
      if (uid) {
        filter.uid = uid;
      }
      const users = await prisma.users.findMany({
          where: filter
       });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  },

  // Get a user by ID
  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await prisma.users.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  },

  // Update a user by ID
  updateUserById: async (req, res) => {
    const { id } = req.params;
    const { email, uid  } = req.body;

    try {
      const updateData = {};
      if (email) {
        updateData.email = email;
        updateData.uid = uid;
      }

      const updatedUser = await prisma.users.update({
        where: { id: Number(id) },
        data: updateData,
      });

      res.json(updatedUser);
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  // Delete a user by ID
  deleteUserById: async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.users.delete({
        where: { id: Number(id) },
      });
      res.status(204).send(); // No content response
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },
};

export default UserController;
