/* eslint-disable import/extensions */
import auth from "./auth.js";


const emailInput = document.getElementById('email');
const submitBtn = document.querySelector('.submit-btn');


submitBtn.addEventListener('click', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const { value: email } = emailInput;

  await auth.forgotPassword(email);
});
