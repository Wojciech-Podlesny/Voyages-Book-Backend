import { NextFunction, Request, Response } from "express";
import prisma from "../database/prisma";

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Server error
 */
// export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
//    try {
//       const users = await prisma.user.findMany();
//       res.status(200).json({success: true, data: users});
//    } catch (error) {
//       next(error)
//    }
// }

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const users = await prisma.user.findMany();
      const safeUsers = users.map(({ password, refreshTokens, ...rest }) => rest); // Remove sensitive fields
      res.status(200).json({ success: true, data: safeUsers });
   } catch (error) {
      next(error);
   }
}

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Server error
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
   const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body
   })
   res.json(user);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
  }
}

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Server error
 */
export const deleteUser = async (req: Request, res: Response) => {
   try {
      await prisma.user.delete({
         where: { id: req.params.id }
      })
      res.json({message: 'User deleted'});
   } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
   }
}

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = await prisma.user.findUnique({
         where: { id: req.params.id }
      })
      if(!user) {
         return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({success: true, data: user});
   } catch(error) {
      next(error)
   }
}

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
export const createUser = async (req: Request, res: Response) => {
   try {
      const { email, password, name } = req.body;
      const newUser = await prisma.user.create({
         data: { email, password, name }
      });
      res.status(201).json(newUser);
   } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
   }
}