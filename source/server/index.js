import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const { connect, connection } = mongoose;

const uri = process.env.DATABASE_URI;

connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = connection;

export default db;
