import { Router } from "express";
import { listBookings, getBooking, createBooking, updateBooking, deleteBooking } from "../controllers/bookings.controller";

const bookingsRouter = Router();

bookingsRouter.get('/', listBookings);
bookingsRouter.get('/:id', getBooking);
bookingsRouter.post('/', createBooking);
bookingsRouter.put('/:id', updateBooking);
bookingsRouter.delete('/:id', deleteBooking);

export default bookingsRouter;



