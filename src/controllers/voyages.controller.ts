import { Request, Response } from 'express'
import prisma from '../database/prisma';

export const getVoyages = async (req: Request, res: Response) => {
   try {
      const voyages = await prisma.voyage.findMany();
      res.json(voyages);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch voyages' });
   }        
}

export const getVoyage = async (req: Request, res: Response) => {
   try {
      const voyage = await prisma.voyage.findUnique({
         where: { id: req.params.id }
      });
      if (!voyage) {
         return res.status(404).json({ error: 'Voyage not found' });
      }
      res.json(voyage);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch voyage' });
   }
}

export const createVoyage = async (req: Request, res: Response) => {
   try {
      const voyage = await prisma.voyage.create({
         data: req.body
      });
      res.status(201).json(voyage);
   } catch (error) {
      res.status(500).json({ error: 'Failed to create voyage' });
   }
}

export const updateVoyage = async (req: Request, res: Response) => {
   try {
      const voyage = await prisma.voyage.update({
         where: { id: req.params.id },
         data: req.body
      });
      res.json(voyage);
   } catch (error) {
      res.status(500).json({ error: 'Failed to update voyage' });
      console.error(error);
   }
}

export const deleteVoyage = async (req: Request, res: Response) => {
   try {
      await prisma.voyage.delete({
         where: { id: req.params.id }
      });
      res.status(204).send();
   } catch (error) {
      res.status(500).json({ error: 'Failed to delete voyage' });
   }
}