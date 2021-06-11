import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const EventSchema = new _Schema({
  _id: {
    type: _Schema.Types.ObjectId,
    required: true,
  },
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
  URL: {
    type: String,
    required: false,
  },
});

export default EventSchema;
