import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const NoteSchema = new _Schema({
  content: {
    type: String,
    required: true,
  },
});

export default NoteSchema;