/* eslint-disable */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import EmailService from '../services/EmailService';

// Increases cost factor to calculate a Bcrypt password hash
const saltRounds = 10;

export default class AuthController {
  // Set our passed in User model
  constructor(UserModel) {
    this.User = UserModel;
  }

  /**
   * User login.
   * @param {email} email - User email
   * @param {password} password - User password
   * @returns {object} User
   */
  async login(req, res) {
    const {
      body: { email, password },
    } = req;

    // Attempt to find this user
    let user;
    try {
      user = await this.User.findOne({ email });
      // Failed to find user
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // Compare the password entered by taking its hash and comparing
    // to hashed password from db
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If it was the correct password, return user
    if (isValidPassword) {
      return res.json({
        success: true,
        data: user,
      });
      // Else this was the incorrect password entered
    } else {
      return res.status(400).json({
        success: false,
        message: 'Password entered is incorrect.',
      });
    }
  }

  /**
   * User signup.
   * @param {name} name - User name
   * @param {email} email - User email
   * @param {password} password - User password
   * @returns {object} User
   */
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
      return res
        .status(400)
        .json({ success: false, error: 'Email already taken.' });
    }

    // Create new user obj
    const newUser = new User({
      name,
      email,
      password: '',
      term: '',
      language: 'English',
    });

    try {
      // Set user password to hash of password entered
      newUser.password = await bcrypt.hash(password, saltRounds);
      // Save new user
      await newUser.save();
      // Return new user
      return res.status(200).json({
        success: true,
        message: 'User successfully signed up',
        data: newUser,
      });
      // Error while trying to hash password
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
        message: 'Failed to sign up user',
      });
    }
  }

  /**
   * User forgot password.
   * @param {email} email - User email
   * @returns {boolean} Success status
   */
  async forgotPassword(req, res) {
    const {
      body: { email },
    } = req;

    // Attempt to find user with given email
    let user;
    try {
      user = await this.User.findOne({ email });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    // If user wasn't found, account registered with this email
    // doesn't exist
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User with this email does not exist.',
      });
    }

    // Else sign a token for resetting user password
    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: '20m',
    });

    // Link for email
    const RESET_LINK = `${process.env.CLIENT_URL}/reset-password/?resetToken=${token}`;

    // Build email
    const emailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'Password Reset Link',
      html: `
        <p>Please click on given link to reset your password</p>
        <a href=${RESET_LINK}>Reset Password</a>
      `,
    };

    // Initialize service for sending emails
    const emailService = new EmailService();

    // Get success status for this send
    const { success } = await emailService.sendMessage(emailOptions);

    // Return success status
    return success;
  }

  /**
   * Handles user password reset.
   * @param {email} email - User email
   * @param {password} password - User password
   * @returns {object} Updated User
   */
  async resetPassword(req, res) {
    // Get reset token and new password
    const {
      body: { token, newPassword },
    } = req;

    // If reset token doesn't exist, authentication error
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: 'Authentication error' });
    }

    // Verify this token
    const decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_KEY);

    let user;
    try {
      // Find user using verified token _id
      user = await this.User.findOne({ _id: decodedToken._id });
      // Set user password to hash of new password entered
      user.password = await bcrypt.hash(newPassword, saltRounds);
      // Save new password
      await user.save();
      // Return user
      return res.status(200).json({
        success: true,
        message: 'Password successfully changed',
        data: user,
      });
      // Error while trying to hash new password
    } catch (error) {
      return res.status(400).json({
        success: false,
        error,
        message: 'Error while trying to reset password',
      });
    }
  }
}
