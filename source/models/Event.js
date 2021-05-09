import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const EventSchema = new _Schema({
  content: String,
  date: Date,
  link: String,
}, { timestamps: true });

export default EventSchema;
