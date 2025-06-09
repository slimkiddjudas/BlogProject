import express from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { addGalleryItem, getGalleryItems, deleteGalleryItem } from '../controllers/gallery.controller.js';
import upload from '../middlewares/fileUploadMiddleware.js';
import { csrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

router.post('/', isAuth, isAdmin, csrfProtection, upload.single('image'), addGalleryItem);
router.get('/', isAuth, getGalleryItems);
router.delete('/:id', isAuth, isAdmin, csrfProtection, deleteGalleryItem);

export default router;
