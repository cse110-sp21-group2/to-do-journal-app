import mongoose from 'mongoose';

// Tasks, events, and notes
import EventSchema from './Event';
import NoteSchema from './Note';
import TaskSchema from './Task';

const { Schema: _Schema } = mongoose;

// Schema
const JournalEntrySchema = new _Schema({
  tasks: {
    type: [TaskSchema],
  },
  notes: {
    type: [NoteSchema],
  },
  events: {
    type: [EventSchema],
  },
  date: {
    type: Date,
    default: Date.now, // Journal entry for new day
  },
}, { timestamps: true });

export default JournalEntrySchema;
