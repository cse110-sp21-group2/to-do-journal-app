/* eslint-disable no-alert */
/* eslint-disable import/extensions */
import auth from "./auth.js";
import session from "./session.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('resetToken');

const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitBtn = document.querySelector('.submit-btn');

if (session.isUserLoggedIn()) {
  window.location.href = '/';
}

submitBtn.addEventListener('click', async (e) => {
  // Prevent page refresh
  e.preventDefault();

  const { value: _newPassword } = passwordInput;
  const { value: newPassword } = confirmPasswordInput;

  if (_newPassword === newPassword) {
    const { message, success } = await auth.resetPassword({ token, newPassword });

    alert(message);

    if (success) { window.location.href = '/' };
  } else {
    alert('Passwords don\'t match');
  }
});
