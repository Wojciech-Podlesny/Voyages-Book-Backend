import {Response,Request} from 'express'
import prisma from '../database/prisma';

export const getShips = async (req: Request, res: Response) => {
   try {
      const ships = await prisma.ship.findMany();
      res.json(ships);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ships' });
   }
}

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