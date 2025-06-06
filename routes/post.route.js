import express from 'express';
import { addPost, getPosts, getPostById, getPostBySlug, updatePost, deletePost, getPostsByCategory, getPostByUser} from '../controllers/post.controller.js';
import { isAuth, isWriter } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/fileUploadMiddleware.js';
import { csrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

router.post('/', isAuth, isWriter, csrfProtection, upload.single('image'), addPost);
router.get('/', isAuth, getPosts);
router.get('/user/:userId', isAuth, getPostByUser);
router.get('/:id', isAuth, getPostById);
router.get('/slug/:slug', isAuth, getPostBySlug);
router.put('/:id', isAuth, isWriter, upload.single('image'), csrfProtection, updatePost);
router.delete('/:id', isAuth, isWriter, csrfProtection, deletePost);
router.get('/category/:categoryId', isAuth, getPostsByCategory);

export default router;