import mongoose from 'mongoose';
import TermWeekSchema from './TermWeek';

const { Schema: _Schema } = mongoose;

// Schema
const TermSchema = new _Schema({
  _id: {
    type: _Schema.Types.ObjectId,
    required: true,
  },
  weeks: {
    type: [TermWeekSchema],
    required: false,
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

export default TermSchema;
