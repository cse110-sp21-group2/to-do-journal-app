/* eslint-disable import/extensions */
import auth from "./auth.js";


const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('.login-btn');


loginBtn.addEventListener('click', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const { value: email } = emailInput;
  const { value: password } = passwordInput;

  await auth.login(email, password)
});
