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
const DOMAIN = 'logic-workspace.com';

// Service for handling our emails
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

export default class AuthController {
  // Set our passed in User model
  constructor(UserModel) {
    this.User = UserModel;
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
      compare(password, user.password, (result, error) => {
        // If comparison isn't equal, password is wrong
        if (!result) {
          res.status(400).json({
            success: false,
            message: 'Password entered is incorrect.',
          });
        }

        // Return user
        res.json({
          data: user,
        });
      });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }

  // Handles new users wanting to register
  async userSignup(req, res) {
    // Initial information required is their name, email and password
    const {
      body: { name, email, password },
    } = req;

    // Get User model
    const { User } = this;

    // Attempt to find user with this email
    const user = await this.User.findOne({ email });

    // If user exists already, then this email is taken
    if (user) {
      res.status(400).json({ success: false, error: 'Email already taken.' });
    }

    // Else, the email is good and we start the user creation process
    // Perform a hash for the new user's password
    _hash(password, saltRounds, async (err, hash) => {
      // Create new user
      const newUser = new User({
        name,
        email,
        password: hash,
        term: '',
        language: 'English',
      });

      // Attempt to update database with new user
      try {
        await newUser.save();
        res.status(200).json({
          success: true,
          data: newUser,
        });
      } catch (error) {
        res.status(400).json({
          error,
          message: 'Error while trying to register account',
        });
      }
    });
  }

  async forgotPassword(req, res) {
    const {
      body: { email },
    } = req;

    // Attempt to find user with given email
    let user;
    try {
      user = await this.User.findOne({ email });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }

    // If user wasn't found, account registered with this email
    // doesn't exist
    if (!user) {
      res.status(404).json({ error: 'User with this email does not exist.' });
    }

    // Else sign a token for resetting user password
    const token = sign({ _id: user.id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: '20m',
    });

    // Link for email
    const RESET_LINK = `https://logic-workspace.herokuapp.com/reset-password/${token}`;

    // Build email
    const data = {
      from: 'noreply@two-do-bujo.com',
      to: 'markbussard@outlook.com',
      subject: 'Password Reset Link',
      html: `
        <p>Please click on given link to reset your password</p>
        <a href=${RESET_LINK}>Reset Password</a>
      `,
    };

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
    const {
      body: { resetLink, newPassword },
      params: { id },
    } = req;

    // If reset link doesn't exist, authentication error
    if (!resetLink) {
      res.status(401).json({ error: 'Authentication error' });
    }

    // Otherwise, now we need to verify accurate reset link
    verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      async (error, decodedData) => {
        if (error) {
          return res.status(401).json({ error: 'Incorrect token or expired.' });
        }

        // Attempt to find user
        let user;
        try {
          user = await this.User.findOne({ _id: id });
        } catch (err) {
          res.status(400).json({ success: false, err });
        }

        // Couldn't find user
        if (!user) {
          res.status(400).json({
            success: false,
            error: "Couldn't find user",
          });
        }

        // Hash new password
        _hash(newPassword, saltRounds, async (err, hash) => {
          try {
            // Set new user password
            user.password = hash;
            // Save changes
            await user.save();
            // return success
            res.status(201).json({
              success: true,
              message: 'Password successfully changed',
            });
          } catch (error) {
            res.status(400).json({
              success: false,
              error,
              message: 'Error while trying to reset password',
            });
          }
        });
      }
    );
  }
}
