import mongoose from 'mongoose';

import JournalEntrySchema from './JournalEntry';

const { Schema: _Schema, model } = mongoose;

// Define the name for our model
const modelName = 'journal';
// Define the collection name from mongoDB
const collection = 'Journal';

// Schema
const JournalSchema = new _Schema({
  journalEntries: {
    type: [JournalEntrySchema],
  },
}, { timestamps: true });

// Create model
const Journal = model(modelName, JournalSchema, collection);

export default Journal;