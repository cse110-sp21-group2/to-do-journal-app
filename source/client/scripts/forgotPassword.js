/* eslint-disable import/extensions */
import auth from "./auth.js";
import session from "./session.js";


const emailInput = document.getElementById('email');
const submitBtn = document.querySelector('.submit-btn');

if (session.isUserLoggedIn()) {
  window.location.href = '/';
}

submitBtn.addEventListener('click', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const { value: email } = emailInput;

  await auth.forgotPassword({ email });
});
