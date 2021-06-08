/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const authAPI = {};

/**
 * Handles user login.
 * @param {string} email - Email for this user.
 * @param {string} password - Password for this user.
 * @returns {Object} User and Journal.
 */
authAPI.login = async ({ email, password }) => {
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
  const { success, data: user = null, message = null } = await _user.json();

  // If it wasn't a successful login, i.e. email or password
  if (!success) {
    return {
      message
    }
  }

  const { _id: id } = user;

  // Otherwise, user login successful  and want to get the journal in
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
 * Handles new user registration.
 * @param {string} name - Name for this user.
 * @param {string} email - Email for this user.
 * @param {string} password - Password for this user.
 * @returns {object} New User.
 */
authAPI.register = async ({ name, email, password }) => {
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
  const { success, data: user = null,  message = null } = await newUser.json();

  // If registration wasn't successful, i.e. user with
  // this given email already exists
  if (!success) {
    return {
      message
    }
  }

  // Otherwise get this new user's id to create their journal
  const { _id: id } = user;

  // Set up our url for the GET request
  url = `/api/create-journal/${id}`;

  // Attempt to create and fetch new user journal
  const newJournal = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  }).catch((err) =>
    console.log(err)
  );

  // Get parsed user journal
  const {
    data: journal,
  } = await newJournal.json();

  return {
    user,
    journal,
  };
};

/**
 * Handles user login through Google OAuth.
 * @param {string} email - Email for this user.
 * @param {string} googleId - Google Id for this user.
 * @returns {object} User and Journal.
 */
authAPI.googleLogin = async ({ email, googleId }) => {
  let url = '/auth/google-login';

  // Attempt to fetch user with given email and password
  const _user = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email,
      googleId,
    }),
    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  // Get parsed request status, and user data
  const { success, data: user = null, message = null } = await _user.json();

  // If it wasn't a successful login, i.e. email or password
  if (!success) {
    return {
      message,
    }
  }

  const { _id: id } = user;


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
 * Handles new user registration through Google OAuth.
 * @param {string} name - Name for this user.
 * @param {string} email - Email for this user.
 * @param {string} googleId - Google Id.
 * @returns {object} New User.
 */
authAPI.googleRegister = async ({ name, email, googleId }) => {
  let url = '/auth/google-signup';

  // Attempt to create user with given information
  const newUser = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      googleId,
    }),
    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const { success, data: user = null, message = null } = await newUser.json();

  // If registration wasn't successful, i.e. user with
  // this given email already exists
  if (!success) {
    return {
      message
    }
  }

  // Otherwise get this new user's id to create their journal
  const { _id: id } = user;

  // Set up our url for the GET request
  url = `/api/create-journal/${id}`;

  // Attempt to create and fetch new user journal
  const newJournal = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  }).catch((err) =>
    console.log(err)
  );

  // Get parsed user journal
  const {
    success: journalSuccess,
    data: journal,
  } = await newJournal.json();

  if (!journalSuccess) {
    // Do something here
  }

  return {
    user,
    journal,
  };
};

/**
 * Handles forgotten passwords.
 * @param {string} email - Email for this user.
 */
authAPI.forgotPassword = async ({ email }) => {
  const url = '/auth/forgot-password';

  // Attempt to send reset link to user with given email
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const result = response.json();

  return result;
};

/**
 * Handles forgotten passwords.
 * @param {string} email - Email for this user.
 * @param {string} newPassword - New password for this user
 * @param {string} resetLink - Reset link given from email.
 */
authAPI.resetPassword = async ({ token, newPassword }) => {
  const url = '/auth/reset-password';
  // Attempt to send reset link to user with given email
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      token,
      newPassword,
    }),
    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const result = response.json();

  return result;
};

export default authAPI;
