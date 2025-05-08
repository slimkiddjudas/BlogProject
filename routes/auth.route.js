import express from 'express';
import { register, login, getProfile, changePassword, updateProfile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes - kimlik doğrulama gerektirmez
router.post('/register', register);
router.post('/login', login);

// Protected routes - kimlik doğrulama gerektirir
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

// Admin routes - admin yetkisi gerektirir (eğer adminMiddleware oluşturduysanız)
// router.get('/users', adminMiddleware, getAllUsers);

// Validation routes - token geçerliliğini kontrol etmek için
router.get('/validate-token', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

// // Logout route - client tarafında token'ı silmek için bir endpoint
// // (Backend'de bir şey yapmaya gerek yok, client token'ı silecek)
// router.post('/logout', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

export default router;