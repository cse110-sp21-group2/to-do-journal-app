import mongoose from 'mongoose';

const { Schema: _Schema } = mongoose;

const TaskSchema = new _Schema({
  _id: {
    type: _Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: false,
  },
});

export default TaskSchema;
