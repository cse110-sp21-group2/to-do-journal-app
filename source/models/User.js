import mongoose from 'mongoose';

const { Schema: _Schema, model } = mongoose;

const modelName = 'user';
const collection = 'User';

const UserSchema = new _Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    term: {
      type: String,
    },
    styles: {
      type: String,
    },
    colors: {
      type: String,
    },
    language: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model(modelName, UserSchema, collection);

export default User;