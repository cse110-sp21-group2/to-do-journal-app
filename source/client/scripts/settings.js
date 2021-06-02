/* eslint-disable no-console */
/* eslint-disable no-undef */
import userAPI from "../api/userAPI.js";
import session from "./session.js";

// The form fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const termInput = document.getElementById('period');
const stylesInput = document.getElementById('color-scheme');
const languageInput = document.getElementById('lang');
const submitBtn = document.querySelector('.save-btn');

// Current User
const user = session.getUser();
// Current user's id
//const id = user._id;
const id = "60b7ec68c67f03bea8ba2fb9";

//Initialize the input fields to display the current user's info
/*nameInput.value = user.userName;
emailInput.value = user.email;
termInput;
stylesInput;
languageInput;*/

/**
 * Updates the settings of the user
 */
submitBtn.addEventListener('click', async () => {

  // Get the values of the form field
  const updatedUser = {
    name: nameInput.value,
    email: emailInput.value,
    term: termInput.value,
    styles: stylesInput.value,
    language: languageInput.value
  }
  
  // Update the user info in the database
  await userAPI.updateUserInfo({id, updatedUser});

  // Update the user info locally
  session.setUser(updatedUser);
});
