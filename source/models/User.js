import mongoose from 'mongoose';

const { Schema: _Schema, model } = mongoose;

const modelName = 'user';
const collection = 'User';

const UserSchema = new _Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  term: String,
  styles: String,
  colors: String,
  language: String,
},
{ timestamps: true });

const User = model(modelName, UserSchema, collection);

export default User;
