import { PrismaClient } from '@prisma/client';
//import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const UserController = {
  // Create a new user
  createUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Hash the password before saving it
      //const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.users.create({
        data: {
          email,
          //password: hashedPassword,
        },
      });

      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  // Get all users
  getUsers: async (req, res) => {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
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
    const { email, password } = req.body;

    try {
      const updateData = {};
      if (email) updateData.email = email;
      if (password) updateData.password = await bcrypt.hash(password, 10);

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
