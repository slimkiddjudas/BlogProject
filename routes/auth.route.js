import express from 'express';
import { register, login, logout, getCurrentUser, changePassword, updateUserProfile } from '../controllers/auth.controller.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', isAuth, getCurrentUser);
router.put('/change-password', isAuth, changePassword);
router.put('/update-profile', isAuth, updateUserProfile);

export default router;