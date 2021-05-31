/* eslint-disable no-console */
import dotenv from 'dotenv';

// Enables express to respond to requests
import cors from 'cors';

// Midddleware for all of our api calls
import express, { json, urlencoded } from 'express';

// Import initialized db
import path from 'path';
import db from './server';

// Import all of our routes
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import journalRouter from './routers/journalRouter';

// Allows use of .env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 1234;

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.resolve(path.dirname(''));

app.use(cors());

app.use(express.static(path.join(__dirname, 'source/client')));

// Landing page, i.e. sign in page
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/signin.html'));
});

// Sign up page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/signup.html'));
});

// Forgot password page
app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/forgot-password.html'));
});

// Reset password page
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/reset-password.html'));
});

// Dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/dashboard.html'));
});

// Daily view
app.get('/daily', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/daily.html'));
});

// Weekly view
app.get('/weekly', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/weekly.html'));
});

// Monthly view
app.get('/monthly', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/monthly.html'));
});

// Semester / Quarter view
app.get('/term', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/semester-quarter.html'));
});

// Profile
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/profile.html'));
});

// User settings
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/user_setting.html'));
});

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
