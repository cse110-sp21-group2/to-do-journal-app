/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import authAPI from '../api/authAPI.js';
// Get session
import session from './session.js';

const auth = {};

/**
 * Handles user login.
 * @param {string} email - Email for this user.
 * @param {string} password - Password for this user.
 * @returns {Object} User and Journal.
 */
auth.login = async (email, password) => {
  const { user, journal } = await authAPI.login(email, password);

  if (user && journal) {
    // Set session user
    session.setUser(user);
    // Set session journal
    session.setJournal(journal);
  }

  // return newly registered user and journal
  return {
    user,
    journal,
  };
};
/**
 * Handles new user registration.
 * @param {string} name - Name for this user.
 * @param {string} email - Email for this user.
 * @param {string} password - Password for this user.
 * @returns {Object} New User and Journal.
 */
auth.register = async (name, email, password) => {
  const { user, journal } = await authAPI.register(name, email, password);

  if (user && journal) {
    // Set session user
    session.setUser(user);
    // Set session journal
    session.setJournal(journal);
  }

  // return newly registered user and journal
  return {
    user,
    journal,
  };
};

/**
 * Handles user login.
 * @param {string} email - Email for this user.
 * @param {string} googleId - Google Id for this user.
 * @returns {Object} User and Journal.
 */
auth.googleLogin = async (email, googleId) => {
  const { user, journal } = await authAPI.googleLogin(email, googleId);
  if (user && journal) {
    // Set session user
    session.setUser(user);
    // Set session journal
    session.setJournal(journal);
  }

  // return newly registered user and journal
  return {
    user,
    journal,
  };
};

/**
 * Handles new user registration.
 * @param {string} name - Name for this user.
 * @param {string} email - Email for this user.
 * @param {string} googleId - Google Id for this user.
 * @returns {Object} New User and Journal.
 */
auth.googleRegister = async (name, email, googleId) => {
  const { user, journal } = await authAPI.googleRegister(name, email, googleId);

  if (user && journal) {
    // Set session user
    session.setUser(user);
    // Set session journal
    session.setJournal(journal);
  }

  // return newly registered user and journal
  return {
    user,
    journal,
  };
};

/**
 * Handles forgotten passwords.
 * @param {string} email - Email for this user.
 */
auth.forgotPassword = async (email) => {
  await authAPI.forgotPassword(email);
};

/**
 * Handles resetting user password.
 * @param {string} token - JWT token.
 * @param {string} newPassword - New password for this user
 */
auth.resetPassword = async (token, newPassword) => {
  const result = await authAPI.resetPassword(token, newPassword);
  // console.log(result);
  return result;
};

export default auth;
