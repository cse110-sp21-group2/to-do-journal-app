const session = {};

/**
 * Sets the user for this session.
 */
session.setUser = (user) => {
  localStorage.setItem('sessionUser', JSON.stringify(user));
};

/**
 * Gets session user.
 * @returns {object} User.
 */
session.getUser = () => JSON.parse(localStorage.getItem('sessionUser'));

/**
 * Checks if user is currently logged in.
 * @returns {bool}
 */
session.isUserLoggedIn = () => {
  const user = JSON.parse(localStorage.getItem('sessionUser'));

  if (user) {
    return true;
  }

  return false;
};

/**
 * Sets the journal for this session
 */
session.setJournal = (journal) => {
  localStorage.setItem('userJournal', JSON.stringify(journal));
};

/**
 * Gets the journal for this session
 * @returns {object} User journal.
 */
session.getJournal = () => JSON.parse(localStorage.getItem('userJournal'));

export default session;
