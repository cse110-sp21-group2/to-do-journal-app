import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const NoteSchema = new _Schema({
  _id: {
    type: _Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default NoteSchema;
