/* eslint-disable no-console */
/* eslint-disable no-undef */
// signin.js

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');

const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const { value: name } = nameInput;
  const { value: email } = emailInput;
  const { value: password } = passwordInput;

  let url = '/auth/signup';

  const newUser = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password
    }),
    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8"
  }
  });

  const { data: user } = await newUser.json();

  const { _id: id } = user;

  url = `/api/create-journal/${id}`;

  const newJournal = await fetch(url).catch((err) => console.log(err));

  const { data: journal } = await newJournal.json();

  localStorage.setItem('sessionUser', JSON.stringify(user));
  localStorage.setItem('userJournal', JSON.stringify(journal));

  const sessionUser = JSON.parse(localStorage.getItem('sessionUser'));
  const userJournal = JSON.parse(localStorage.getItem('userJournal'));

  console.log(sessionUser);
  console.log(userJournal);
});
