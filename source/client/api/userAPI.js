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

/**
 * Updates user info / settings / preferences
 * @param {string} id - User Id.
 * @param {object} updatedUser - contains the updated info for the user
 * @returns {object} Updated user info
 */
 userAPI.updateUserInfo = async ({id, updatedUser}) => {
  const url = `/api/update-user-info/${id}`;

  // Attempt to send update request to user
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      updatedUser,
    }),
    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).catch((err) => console.log(err));

  const result = response.json();

  return result;
}

export default userAPI;
