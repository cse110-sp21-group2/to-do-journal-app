import mongoose from 'mongoose';

const { Schema: _Schema, model } = mongoose;

const modelName = 'user';
const collection = 'User';

const UserSchema = new _Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    term: {
      type: String,
      default: 'Quarter',
    },
    fonts: {
      type: String,
      required: false,
    },
    theme: {
      type: String,
      default: 'Light',
    },
    language: {
      type: String,
      default: 'English',
    },
    firstDayOfTheWeek: {
      type: String,
      default: 'Monday',
    },
    google: {
      id: String,
      email: String,
      name: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = model(modelName, UserSchema, collection);

export default User;
