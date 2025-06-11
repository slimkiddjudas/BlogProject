import express from 'express';
import { register, login, logout, getCurrentUser, changePassword, updateUserProfile, changeUserRole, getAllUsers } from '../controllers/auth.controller.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuth, logout);
router.get('/me', isAuth, getCurrentUser);
router.put('/change-password', isAuth, changePassword);
router.put('/update-profile', isAuth, updateUserProfile);
router.put('/change-role', isAuth, isAdmin, changeUserRole);
router.get('/users', isAuth, isAdmin, getAllUsers);

export default router;