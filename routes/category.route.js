import express from 'express';
import { getCategories, getCategoryById, addCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { csrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', isAuth, isAdmin, csrfProtection, addCategory);
router.get('/:id', getCategoryById);
router.put('/:id', isAuth, isAdmin, csrfProtection, updateCategory);
router.delete('/:id', isAuth, isAdmin, csrfProtection, deleteCategory);

export default router;