/* eslint-disable no-console */
import dotenv from 'dotenv';

// Enables express to respond to requests
import cors from 'cors';

// Midddleware for all of our api calls
import express, { json, urlencoded } from 'express';

// Import initialized db
import db from './server';

// Import all of our routes
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import journalRouter from './routers/journalRouter';

// Allows use of .env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 1234;

app.use(cors());

// For recognizing incoming requests as a JSON object
app.use(json());
// For recognizing incoming requests as strings or arrays
app.use(urlencoded({ extended: false }));

/* Routes for API calls */
app.use('/auth', authRouter);
app.use('/api', userRouter);
app.use('/api', journalRouter);
/*  */

// Listening for any connection errors with database
db.on('err', console.error.bind(console, 'MongoDB connection error:'));

// Listening to which port the server is currently running on
app.listen(port, () =>
  console.log(`Server running on port: http://localhost:${port}`)
);
