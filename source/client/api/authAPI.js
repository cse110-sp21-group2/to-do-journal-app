/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const authAPI = {};

/**
 * Handles user login
 * @param {string} email - Email for this user
 * @param {string} password - Password for this user
 * @returns {object} User.
 */
authAPI.login = async (email, password) => {
  let url = '/auth/login';

  // Attempt to fetch user with given email and password
  const _user = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  // Get parsed request status, and user data
  const { success, data: user } = await _user.json();

  const { _id: id } = user;
  // If it wasn't a successful login, i.e. email or password
  if (!success) {
    // Do stuff here
  }

  // Otherwise, we got user and want to get the journal in
  // relation to this user
  url = `/api/journal/${id}`;

  // Attempt to fetch user's journal
  const _journal = await fetch(url).catch((err) => console.log(err));

  // Get parsed user journal
  const { data: journal } = await _journal.json();

  return {
    user,
    journal,
  };
};

/**
 * Handles new user registration
 * @param {string} name - Name for this user
 * @param {string} email - Email for this user
 * @param {string} password - Password for this user
 * @returns {object} New User.
 */
authAPI.register = async (name, email, password) => {
  let url = '/auth/signup';

  // Attempt to create user with given information
  const newUser = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const { success, data: user } = await newUser.json();

  // If registration wasn't successful, i.e. user with
  // this given email already exists
  if (!success) {
    // Do something here
  }

  // Otherwise get this new user's id to create their journal
  const { _id: id } = user;

  // Set up our url for the GET request
  url = `/api/create-journal/${id}`;

  // Attempt to create and fetch new user journal
  const newJournal = await fetch(url).catch((err) => console.log(err));

  // Get parsed user journal
  const { success: journalSuccess, data: journal } = await newJournal.json();

  if (!journalSuccess) {
    // Do something here
  }

  return {
    user,
    journal,
  };
};

export default authAPI;
