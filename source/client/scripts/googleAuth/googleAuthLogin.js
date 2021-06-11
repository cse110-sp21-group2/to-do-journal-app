/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

import auth from '../auth.js';

// Successful google auth login
const onSuccess = async (googleUser) => {
  const email = googleUser.getBasicProfile().getEmail();
  const googleId = googleUser.getBasicProfile().getId();

  const { success, message } = await auth.googleLogin({email, googleId});

  if (success) {
    window.location.href = '/';
  } else {
    // eslint-disable-next-line no-alert
    alert(message);
  }
};

// Failed google auth login
const onFailure = (error) => {
  console.log(error);
};

// Called when signin page is navigated to to render
// our google login button
window.onload = () => {
  // Render google auth button using div id
  gapi.signin2.render('google-sign-in', {
    scope: 'profile email',
    width: 240,
    height: 50,
    longtitle: true,
    theme: 'dark',
    onsuccess: onSuccess,
    onfailure: onFailure,
  });
};
