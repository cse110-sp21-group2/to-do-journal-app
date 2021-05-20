import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const NoteSchema = new _Schema(
  {
    content: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default NoteSchema;