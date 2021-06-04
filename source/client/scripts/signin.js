/* eslint-disable import/extensions */
import auth from './auth.js';
import session from './session.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('.login-btn');

if (session.isUserLoggedIn()) {
  window.location.href = '/';
}

loginBtn.addEventListener('click', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const { value: email } = emailInput;
  const { value: password } = passwordInput;

  const payload = {
    email,
    password,
  };

  const { user = null, message = null } = await auth.login(payload);

  if (user) {
    window.location.href = '/';
  } else {
    // eslint-disable-next-line no-alert
    alert(message);
  }
});
