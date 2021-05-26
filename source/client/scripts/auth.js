/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */

import authAPI from '../api/authAPI.js';
// Get session
import session from './session.js';

const auth = {};

/**
 * Handles user login
 * @param {string} email - Email for this user
 * @param {string} password - Password for this user
 * @returns {object} User.
 */
auth.login = async (email, password) => {
  const { user, journal } = await authAPI.login(email, password);

  if (user && journal) {
    // Set session user
    session.setUser(user);
    // Set session journal
    session.setJournal(journal);

    const sessionUser = session.getUser();
    const userJournal = session.getJournal();

    console.log(sessionUser);
    console.log(userJournal);
  }
};

/**
 * Handles new user registration
 * @param {string} name - Name for this user
 * @param {string} email - Email for this user
 * @param {string} password - Password for this user
 * @returns {object} New User.
 */
auth.register = async (name, email, password) => {
  const { user, journal } = await authAPI.register(name, email, password);

  if (user && journal) {
    // Set session user
    session.setUser(user);
    // Set session journal
    session.setJournal(journal);

    const sessionUser = session.getUser();
    const userJournal = session.getJournal();

    console.log(sessionUser);
    console.log(userJournal);
  }
};

export default auth;
