import { Router, Request, Response } from 'express';
import prisma from '../database/prisma';

export const listBookings = async (req: Request, res: Response) => {
   try {
      const bookings = await prisma.booking.findMany();
      res.json(bookings);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookings', e: error });
   }
}

export const getBooking = async (req: Request, res: Response) => {
   try {
      const booking = await prisma.booking.findUnique({
         where: { id: req.params.id }
      });
      if(!booking) {
         return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch booking' });
   }
}

export const createBooking = async (req: Request, res: Response) => {
   try {
      const booking = await prisma.booking.create({
         data: req.body
      });
      res.status(201).json(booking);
   } catch (error) {
      res.status(500).json({ error: 'Failed to create booking' });
   }
}

export const updateBooking = async (req: Request, res: Response) => {
   try {
      const booking = await prisma.booking.update({
         where: { id: req.params.id },
         data: req.body
      });
      res.json(booking);
   } catch (error) {
      res.status(500).json({ error: 'Failed to update booking' });
   }  
}

export const deleteBooking = async (req: Request, res: Response) => {
   try {
      await prisma.booking.delete({
         where: { id: req.params.id }
      });
      res.status(204).send();
   } catch (error) {
      res.status(500).json({ error: 'Failed to delete booking' });
   }
}
