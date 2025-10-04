import { Router, Request, Response } from 'express';
import prisma from '../database/prisma';

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 *       500:
 *         description: Server error
 */
export const listBookings = async (req: Request, res: Response) => {
   try {
      const bookings = await prisma.booking.findMany();
      res.json(bookings);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookings', e: error });
   }
}

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               voyageId:
 *                 type: string
 *               status:
 *                 type: string
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
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
 *         description: Booking updated successfully
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Booking deleted successfully
 *       500:
 *         description: Server error
 */
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