import express from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { addGalleryItem, getGalleryItems, deleteGalleryItem } from '../controllers/gallery.controller.js';
import upload from '../middlewares/fileUploadMiddleware.js';

const router = express.Router();

router.post('/', isAuth, isAdmin, upload.single('image'), addGalleryItem);
router.get('/', isAuth, getGalleryItems);
router.delete('/:id', isAuth, isAdmin, deleteGalleryItem);

export default router;
