import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const EventSchema = new _Schema(
  {
    content: {
      type: String,
    },
    date: {
      type: Date,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

export default EventSchema;
