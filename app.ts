import express , {Request,Response}from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';
import bookingsRouter from './routes/bookings.routes';
import shipsRouter from './routes/ships.routes';
import voyagesRouter from './routes/voyages.routes';
import {swaggerSpec} from './config/swagger';
import errorMiddleware from './middlewares/error.middleware';
import passport from 'passport';



const app = express();
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: false }));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());


app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/voyages', voyagesRouter);
app.use('/bookings', bookingsRouter);
app.use('/ships', shipsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware)

app.get('/', (req: Request, res: Response) => {
  res.send('Voyages Book Backend is running');
});



app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});

