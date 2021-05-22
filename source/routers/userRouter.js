import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';

// Initialize a Router instance
const router = Router();

// Initialize new User Controller
const userController = new UserController(User);

// Route for getting user by ID
router.get('/user-by-id/:id', (req, res) => {
  userController.getUserById(req, res);
});

// Route for getting user by email
router.get('/user-by-email/:email', (req, res) => {
  userController.getUserByEmail(req, res);
});

export default router;
