import mongoose from 'mongoose';

// Tasks, events, and notes
import EventSchema from './Event';
import NoteSchema from './Note';
import TaskSchema from './Task';

const { Schema: _Schema } = mongoose;

// Schema
const TermWeekSchema = new _Schema({
  _id: {
    type: _Schema.Types.ObjectId,
    required: true,
  },
  tasks: {
    type: [TaskSchema],
    required: true,
  },
  notes: {
    type: [NoteSchema],
    required: true,
  },
  events: {
    type: [EventSchema],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

export default TermWeekSchema;
