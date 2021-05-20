import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const TaskSchema = new _Schema(
  {
    content: {
      type: String,
    },
    date: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default TaskSchema;