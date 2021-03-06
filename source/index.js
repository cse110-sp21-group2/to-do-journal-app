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
import AuthRouter from './routers/AuthRouter';
import UserRouter from './routers/UserRouter';
import JournalRouter from './routers/JournalRouter';
import mongoose from 'mongoose';

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

// Index
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/index.html'));
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

// Collections view
app.get('/collections/', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/collection.html'))
});


// User settings
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/client/views/user_settings.html'));
});

// For recognizing incoming requests as a JSON object
app.use(json());
// For recognizing incoming requests as strings or arrays
app.use(urlencoded({ extended: false }));

/* Routes for API calls */
app.use('/auth', AuthRouter);
app.use('/api', UserRouter);
app.use('/api', JournalRouter);
/*  */

if (process.env.NODE_ENV === "production"){
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

// Testing new commit
// Listening for any connection errors with database
// db.on('err', console.error.bind(console, 'MongoDB connection error:'));

// // Listening to which port the server is currently running on
// app.listen(port, () =>
//   console.log(`Server running on port: http://localhost:${port}`)
// );

const uri = process.env.DATABASE_URI;

// URI is where database is stored, the properties set in the 2nd argument is to make it easier to access MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


// Mongo Connection
const connection = mongoose.connection;
connection.once('open', () => {

  console.log("MongoDB database connection established successfully!");
})

// This is how we start a server with a port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})

// Export app to use for unit testing
export default app;
