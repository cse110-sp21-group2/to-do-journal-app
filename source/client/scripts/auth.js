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
auth.login = async (payload) => {
  const { user, journal } = await authAPI.login(payload);

  const { _id, email, name, firstDayOfTheWeek, term, theme } = user;

  const _user = {
    _id,
    email,
    name,
    firstDayOfTheWeek,
    term,
    theme,
  };

  if (_user && journal) {
    // Set session user
    session.setUser(_user);
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
auth.register = async (payload) => {
  const { user, journal } = await authAPI.register(payload);

  const { _id, email, name, firstDayOfTheWeek, term, theme } = user;

  const _user = {
    _id,
    email,
    name,
    firstDayOfTheWeek,
    term,
    theme,
  };

  if (_user && journal) {
    // Set session user
    session.setUser(_user);
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
 * @param {Object} payload - Data for this user.
 * @param {string} email - Email for this user.
 * @param {string} googleId - Google Id for this user.
 * @returns {Object} User and Journal.
 */
auth.googleLogin = async (payload) => {
  const { user, journal } = await authAPI.googleLogin(payload);

  const { _id, email, name, firstDayOfTheWeek, term, theme } = user;

  const _user = {
    _id,
    email,
    name,
    firstDayOfTheWeek,
    term,
    theme,
  };

  if (_user && journal) {
    // Set session user
    session.setUser(_user);
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
 * @param {Object} payload - Data for this user.
 * @returns {Object} New User and Journal.
 */
auth.googleRegister = async (payload) => {
  const { user, journal } = await authAPI.googleRegister(payload);

  const { _id, email, name, firstDayOfTheWeek, term, theme } = user;
  const _user = {
    _id,
    email,
    name,
    firstDayOfTheWeek,
    term,
    theme,
  };
  if (_user && journal) {
    // Set session user
    session.setUser(_user);
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
 * @param {Object} payload - Email for this user.
 */
auth.forgotPassword = async (payload) => {
  await authAPI.forgotPassword(payload);
};

/**
 * Handles resetting user password.
 * @param {Object} payload - JWT token and new password.
 */
auth.resetPassword = async (payload) => {
  const result = await authAPI.resetPassword(payload);

  return result;
};

export default auth;
