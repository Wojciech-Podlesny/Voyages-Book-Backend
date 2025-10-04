import {Response,Request} from 'express'
import prisma from '../database/prisma';

/**
 * @swagger
 * /ships:
 *   get:
 *     summary: Get all ships
 *     tags: [Ships]
 *     responses:
 *       200:
 *         description: List of all ships
 *       500:
 *         description: Server error
 */
export const getShips = async (req: Request, res: Response) => {
   try {
      const ships = await prisma.ship.findMany();
      res.json(ships);
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch ships' });
   }
}

/**
 * @swagger
 * /ships/{id}:
 *   get:
 *     summary: Get ship by ID
 *     tags: [Ships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ship details
 *       404:
 *         description: Ship not found
 *       500:
 *         description: Server error
 */
export const getShip = async (req: Request, res: Response) => {
   try {
      const ship = await prisma.ship.findUnique({
         where: { id: req.params.id }
      });
      if (!ship) {
         return res.status(404).json({ error: 'Ship not found' });
      }
      res.json(ship);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ship' });
   }
}

/**
 * @swagger
 * /ships:
 *   post:
 *     summary: Create new ship
 *     tags: [Ships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ship created successfully
 *       500:
 *         description: Server error
 */
export const createShip = async (req: Request, res: Response) => {
   try {
      const ship = await prisma.ship.create({
         data: req.body
      });
      res.status(201).json(ship);
   } catch (error) {
      res.status(500).json({ error: 'Failed to create ship' });
   }
}

/**
 * @swagger
 * /ships/{id}:
 *   put:
 *     summary: Update ship
 *     tags: [Ships]
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
 *         description: Ship updated successfully
 *       500:
 *         description: Server error
 */
export const updateShip = async (req: Request, res: Response) => {
   try {
      const ship = await prisma.ship.update({
         where: { id: req.params.id },
         data: req.body
      });
      res.json(ship);
   } catch (error) {
      res.status(500).json({ error: 'Failed to update ship' });
   }
}

/**
 * @swagger
 * /ships/{id}:
 *   delete:
 *     summary: Delete ship
 *     tags: [Ships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ship deleted successfully
 *       500:
 *         description: Server error
 */
export const deleteShip = async (req: Request, res: Response) => {
   try {
      await prisma.ship.delete({
         where: { id: req.params.id }
      });
      res.status(204).send();
   } catch (error) {
      res.status(500).json({ error: 'Failed to delete ship' });
   }
}