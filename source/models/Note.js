import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const NoteSchema = new _Schema({
  content: String,
  date: {
    type: Date,
  },
  dueDate: Date,
}, { timestamps: true });

export default NoteSchema;
