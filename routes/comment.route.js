import express from 'express';
import { addComment, getCommentsByPostId, updateComment, deleteComment } from '../controllers/comment.controller.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { csrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

router.post('/', isAuth, csrfProtection, addComment);
router.get('/:postId', isAuth, getCommentsByPostId);
router.put('/:id', isAuth, csrfProtection, updateComment);
router.delete('/:id', isAuth, csrfProtection, deleteComment);

export default router;
