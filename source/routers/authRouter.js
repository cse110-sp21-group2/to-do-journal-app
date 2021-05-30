import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import User from '../models/User';

// Initialize a Router instance
const router = Router();

// Initialize new User Controller
const authController = new AuthController(User);

// Route for user login
router.post('/login', (req, res) => {
  authController.login(req, res);
});

// Route for user logout
router.post('/signup', (req, res) => {
  authController.userSignup(req, res);
});

// Route for handling forgotten passwords
router.post('/forgot-password', (req, res) => {
  authController.forgotPassword(req, res);
});

// Route for handling password resets
router.put('/reset-password', (req, res) => {
  authController.resetPassword(req, res);
});

export default router;
