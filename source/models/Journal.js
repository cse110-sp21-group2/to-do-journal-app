import mongoose from 'mongoose';

import JournalEntrySchema from './JournalEntry';
import CollectionSchema from './Collection';
import TermSchema from './Term';

const { Schema: _Schema, model } = mongoose;

// Define the name for our model
const modelName = 'journal';
// Define the collection name from mongoDB
const collection = 'Journal';
// Schema
const JournalSchema = new _Schema(
  {
    _id: {
      type: _Schema.Types.ObjectId,
      required: true,
    },
    dailyEntries: {
      type: [JournalEntrySchema],
      required: true,
    },
    weeklyEntries: {
      type: [JournalEntrySchema],
      required: true,
    },
    monthlyEntries: {
      type: [JournalEntrySchema],
      required: true,
    },
    terms: {
      type: [TermSchema],
      required: true,
    },
    collections: {
      type: [CollectionSchema],
      required: true,
    },
  },
  { timestamps: true }
);

// Create model
const Journal = model(modelName, JournalSchema, collection);

export default Journal;
