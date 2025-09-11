    import express, {Request, Response} from 'express';
    import cors from 'cors';
    // import {PORT} from './config/env';
    import cookieParser from 'cookie-parser';

    import authRouter from './routes/auth.routes';
    import usersRouter from './routes/users.routes';
    import voyagesRouter from './routes/voyages.routes';
    import bookingsRouter from './routes/bookings.routes';
    import shipsRouter from './routes/ships.routes';
    // import connectToDatabase from './database/mongodb';


    const app = express();
    const port =  process.env.PORT || 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors(
      {origin: 'http://localhost:3000', credentials: true}
    ));
    app.use(cookieParser());

    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/voyages', voyagesRouter);
    app.use('/bookings', bookingsRouter);
    app.use('/ships', shipsRouter);

    

    app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to the Voyages Book API');
    });

    app.listen(port, async () => {
      console.log(`Server is running at http://localhost:${port}`);
      // await connectToDatabase();
    });