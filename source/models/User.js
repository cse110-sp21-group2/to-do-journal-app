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
      required: true,
    },
    term: {
      type: String,
      required: false,
    },
    styles: {
      type: String,
      required: false,
    },
    colors: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = model(modelName, UserSchema, collection);

export default User;
