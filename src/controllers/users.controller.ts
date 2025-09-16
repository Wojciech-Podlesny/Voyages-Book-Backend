import { Request, Response } from "express";
import prisma from "../database/prisma";

export const getUsers = async (req: Request, res: Response) => {
   try {
      const users = await prisma.user.findMany();
      res.json(users);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
   }
}

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
  
export const getUser = async (req: Request, res: Response) => {
   try {
      const user = await prisma.user.findUnique({
         where: { id: req.params.id }
      })
      if(!user) {
         return res.status(404).json({ error: 'User not found' });
      }
      res.json(user)
   } catch(error) {
      res.status(500).json({ error: 'Failed to fetch user' });
   }
}