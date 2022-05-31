/* eslint-disable import/extensions */
/* eslint-disable no-console */
import auth from './auth.js';
import session from './session.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');

const submitBtn = document.querySelector('.submit-btn');

if (session.isUserLoggedIn()) {
  window.location.href = '/';
}

submitBtn.addEventListener('click', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const { value: name } = nameInput;
  const { value: email } = emailInput;
  const { value: password } = passwordInput;

  const payload = {
    name,
    email,
    password,
  };

  const { success, message } = await auth.register(payload);

  if (success) {
    window.location.href = '/';
  } else {
    // eslint-disable-next-line no-alert
    alert(message);
  }
});
