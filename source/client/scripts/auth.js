/* eslint-disable no-alert */
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
  const { user = null, journal, message = null } = await authAPI.login(payload);

  if (!user) {
    // eslint-disable-next-line no-alert
    return {
      message
    }
  }

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
  const { user = null, journal, message = null } = await authAPI.register(payload);

  if (!user) {
    return {
      message
    }
  }

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
  const { user = null, journal } = await authAPI.googleLogin(payload);

  if (!user) {
    return {
      message: 'Failed to authenticate with given Google credentials'
    }
  }

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
  const { message } = await authAPI.forgotPassword(payload);

  return message
};

/**
 * Handles resetting user password.
 * @param {Object} payload - JWT token and new password.
 */
auth.resetPassword = async (payload) => {
  const { success , message } = await authAPI.resetPassword(payload);

  return {success, message };
};

export default auth;
