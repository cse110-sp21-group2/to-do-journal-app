import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const TaskSchema = new _Schema({
  content: String,
  date: {
    type: Date,
  },
  dueDate: Date,
}, { timestamps: true });

export default TaskSchema;
