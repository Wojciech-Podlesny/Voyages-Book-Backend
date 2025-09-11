import { Router, Request, Response } from 'express';

export const listBookings = async (req: Request, res: Response) => {
   res.send('List of bookings')
}

export const getBooking = async (req: Request, res: Response) => {
   res.send('Booking details')
}

export const createBooking = async (req: Request, res: Response) => {
   res.send('Booking created')
}

export const updateBooking = async (req: Request, res: Response) => {
   res.send('Booking updated')
}

export const deleteBooking = async (req: Request, res: Response) => {
   res.send('Booking deleted')
}
