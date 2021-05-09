import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import User from '../models/User';

// Initialize a Router instance
const router = Router();

// Initialize new User Controller
const authController = new AuthController(User);

// Route for user login
router.post('/login', (req, res)=> {
  authController.login(req, res)
});

// Route for user logout
router.post('/logout', (req, res)=> {
  authController.logout(req, res)
});

// Route for user logout
router.post('/logout', (req, res)=> {
  authController.logout(req, res)
});

// Route for verifying and activating new user account
router.post('/activate-account', (req, res)=> {
  authController.activateUserAccount(req, res)
});

// Route for handling forgotten passwords
router.put('/forgot-password', (req, res)=> {
  authController.forgotPassword(req, res)
});

// Route for handling password resets
router.put('/reset-password', (req, res)=> {
  authController.resetPassword(req, res)
});

export default router;
