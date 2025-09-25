import { Request, Response } from 'express'
import prisma from '../database/prisma';

/**
 * @swagger
 * /voyages:
 *   get:
 *     summary: Get all voyages
 *     tags: [Voyages]
 *     responses:
 *       200:
 *         description: List of all voyages
 *       500:
 *         description: Server error
 */
export const getVoyages = async (req: Request, res: Response) => {
   try {
      const voyages = await prisma.voyage.findMany();
      res.json(voyages);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch voyages' });
   }        
}

/**
 * @swagger
 * /voyages/{id}:
 *   get:
 *     summary: Get voyage by ID
 *     tags: [Voyages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voyage details
 *       404:
 *         description: Voyage not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /voyages:
 *   post:
 *     summary: Create new voyage
 *     tags: [Voyages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               price:
 *                 type: number
 *               shipId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Voyage created successfully
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /voyages/{id}:
 *   put:
 *     summary: Update voyage
 *     tags: [Voyages]
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
 *     responses:
 *       200:
 *         description: Voyage updated successfully
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /voyages/{id}:
 *   delete:
 *     summary: Delete voyage
 *     tags: [Voyages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Voyage deleted successfully
 *       500:
 *         description: Server error
 */
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