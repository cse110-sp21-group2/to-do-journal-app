/* eslint-disable */
import jwt from 'jsonwebtoken';
import mailgun from 'mailgun-js';
import { compare, hash as _hash } from 'bcrypt';

import _ from 'lodash';

// For creating and verifying tokens for user authentication / creation
const { sign, verify } = jwt;

// Increases cost factor to calculate a Bcrypt password hash
const saltRounds = 10;

// Domain to be used for sending out emails from
const DOMAIN = 'www.something.com';

// Service for handling our emails
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

export default class AuthController {
  // Set our passed in User model
  constructor(UserModel) {
    this.User = UserModel
  }

  async login(req, res) {
    const { email, password } = req.body;

    let user;

    // Attempt to find this user
    try {
      user = await this.User.findOne({ email });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }

    // Compare the password entered by taking its hash and comparing
    // to password from db
    try {
      compare(password, user.password, (result) => {
        // If comparison isn't equal, password is wrong
        if (!result) {
          return res.status(400).json({
            success: false,
            message: 'Password entered is incorrect.',
          });
        }

        // Else successful and we create an authentication token
        const token = sign({ _id: user.id }, process.env.JWT_LOGIN_KEY, {
          expiresIn: '7d',
        });

        // Assign token to user
        user.accessToken = token;
        // Return user object
        res.json({
          data: user,
        });
      });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }

  // Handles logout
  async logout(req, res) {
    // Get user email
    const { email } = req.body;

    try {
      // Attempt to find user
      const user = await this.User.findOne({ email });

      // Found user, so we remove their access token previously set
      user.accessToken = '';

      // Update the database
      await user.save();
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }

  // Handles new users wanting to register
  async userSignup(req, res) {
    // Initial information required is their email and password
    // which they want to use
    const {
      email,
      password,
    } = req.body;

    // Attempt to find user with this email
    const user = await this.User.findOne({ email });

    // If user exists already, then this email is taken
    if (user) {
      res.status(400).json({ success: false, error: 'Email already taken.' });
    }

    // Else, the email is good and we create a token for registration
    // Sign token using email and password, and assign an activation token
    const token = sign(
      {
        email,
        password,
      },
      process.env.JWT_ACC_ACTIVATE,
      { expiresIn: '1d' },
    );

    // Link to verify account email
    const VERIFICATION_LINK = `${process.env.CLIENT_URL}/register-user/${token}`;

    // Build email
    const data = {
      from: 'noreply@two-do-bujo.com',
      to: email,
      subject: 'Account Registration Link',
      html: `
          <a href=${VERIFICATION_LINK}>Click this link to register</a>
      `,
    };

    // Attempt to send email through Mailgun service
    try {
      mg.messages().send(data);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }

  // Handles activation of user accounts
  // Called after user clicks registration link from email
  // and is finished setting some of their personal information
  async activateUserAccount(req, res) {
    // Get token and user information
    const {
      params: {
        token,
      },
      body: {
        firstName,
        lastName,
        term,
      },
    } = req;

    const { User } = this;

    // If the token exists
    if (token) {
      // Attempt to verify user token
      verify(token, process.env.JWT_ACC_ACTIVATE, (err, decodedToken) => {
        // The token has expired
        if (err) {
          return res.status(400).json({ error: 'Incorrect or expired link' });
        }

        // Get user email and password from this decoded token
        const { email, password } = decodedToken;

        // Perform a hash for the new user's password
        _hash(password, saltRounds, (err, hash) => {

          // Create new user
          const newUser = new User({
            firstName,
            lastName,
            term,
            email,
            password: hash,
          });
          // Update database with new user
          newUser
            .save()
            .then(() => res.status(200).json({
              success: true,
              id: newUser.id,
              data: newUser,
            }))
            .catch((error) => res.status(400).json({
              error,
              message: 'Error while trying to register account',
            }));
        });
      });
    }
  }

  // eslint-disable-next-line consistent-return
  async forgotPassword(req, res) {
    const { email } = req.body;

    // Attempt to find user existing with given email
    let user;
    try {
      user = await this.User.findOne(email);
    } catch (error) {
      res.status(400).json({ success: false, error });
    }

    // If user wasn't found, account registered with this email
    // doesn't exist
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User with this email does not exist.' });
    }

    // Else sign a token for resetting user password
    const token = sign({ _id: user.id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: '20m',
    });

    // Link for email
    const RESET_LINK = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Build email
    const data = {
      from: 'noreply@logic-workspace.com',
      to: email,
      subject: 'Password Reset Link',
      html: `
        <p>Please click on given link to reset your password</p>
        <a href=${RESET_LINK}>Reset Password</a>
      `,
    };

    // Update user with new reset link token
    try {
      await user.updateOne({ resetLink: token });
    } catch (error) {
      return res.status(400).json({ error: 'Reset password link error' });
    }

    // Use Mailgun service to send email
    mg.messages().send(data, (error) => {
      if (error) {
        return res.json({
          error: error.message,
        });
      }
      return res.json({
        message:
        'An email has been sent, please follow the instructions to reset your password.',
      });
    });
  }

  // Handles resetting user password after user has clicked
  // reset link and has finished entering new password
  async resetPassword(req, res) {
    // Get reset link and new password
    const { resetLink, newPassword } = req.body;

    // If reset link exists, this is correct email
    if (resetLink) {
      // Verify accurate reset link
      verify(resetLink, process.env.RESET_PASSWORD_KEY,
        async (error, decodedData) => {
          if (error) {
            return res.status(401).json({ error: 'Incorrect token or expired.' });
          }

          // Attempt to find user
          let user;
          try {
						 user = await this.User.findOne({ resetLink });
          } catch (err) {
            res.status(400).json({ success: false, err });
          }

          // User with this email found is not correct one
          if (!user) {
            res.status(400).json({
              success: false,
              error: 'User with this token does not exist',
            });
          }

          // Hash new password
          _hash(newPassword, saltRounds, async (err, hash) => {
            const obj = {
              password: hash,
              resetLink: '',
            };

            try {
              user = _.extend(user, obj);

              await user.save();

              res.status(201).json({
                success: true,
                message: 'Password successfully changed',
              });
            } catch (e) {
              res.status(400).json({
                success: false,
                e,
                message: 'Error while trying to reset password',
              });
            }
				  });
	      });
    } else {
      res.status(401).json({ error: 'Authentication error' });
    }
  }
}
