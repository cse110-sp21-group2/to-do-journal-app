/* eslint-disable import/extensions */
/* eslint-disable no-console */
import auth from "./auth.js";

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');

const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const { value: name } = nameInput;
  const { value: email } = emailInput;
  const { value: password } = passwordInput;

  await auth.register(name, email, password)
});
