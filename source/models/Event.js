import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const EventSchema = new _Schema({
  content: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: false,
  },
  endTime: {
    type: Date,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
});

export default EventSchema;
