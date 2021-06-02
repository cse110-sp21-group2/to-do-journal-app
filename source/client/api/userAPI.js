/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const userAPI = {};

/**
 * Retrieves a user by their id.
 * @param {string} id - Id for this user.
 * @returns {object} User.
 */
userAPI.getUserById = async (id) => {
  const url = `/api/user-by-id/${id}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

/**
 * Retrieves a user by their email.
 * @param {string} email - Email for this user.
 * @returns {object} User.
 */
userAPI.getUserByEmail = async (email) => {
  const url = `/api/user-by-email/${email}`;
  const response = await fetch(url).catch((err) => console.log(err));
  const result = response.json();

  return result;
};

// TO-DO
/**
 * Retrieves a user by their email.
 * @param {string} id - Id for this user.
 * @returns {object} User.
 */
// userAPI.updateUserInfo = async (id, updatedUser) => {
//   const url = `/api/user-by-email/${email}`;
//   const response = await fetch(url).catch((err) => console.log(err));
//   const result = response.json();

//   return result;
// };

export default userAPI;
