import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';
import voyagesRouter from './routes/voyages.routes';
import bookingsRouter from './routes/bookings.routes';
import shipsRouter from './routes/ships.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import rateLimit from 'express-rate-limit';
// import errorMiddleware from './middlewares/error.middleware';
// import authorize from './middlewares/auth.middleware';


// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 100, 
//   standardHeaders: 'draft-7',
//   legacyHeaders: false,
// })

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors({origin: 'http://localhost:3000',credentials: false}));
app.use(cookieParser());
// app.use(limiter);
// app.use(helmet())


app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/voyages', voyagesRouter);
app.use('/bookings', bookingsRouter);
app.use('/ships', shipsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use(errorMiddleware)
// app.use(authorize);







app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Voyages Book API');
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// app.listen(3000,'0.0.0.0', () => {
//   console.log('Server is running on http://0.0.0.0:3000');
// });
