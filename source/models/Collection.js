import mongoose from 'mongoose';

// Tasks, events, and notes
import EventSchema from './Event';
import NoteSchema from './Note';
import TaskSchema from './Task';

const { Schema: _Schema } = mongoose;

// Schema
const CollectionSchema = new _Schema(
  {
    _id: {
      type: _Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
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
  },
  { timestamps: true }
);

export default CollectionSchema;
