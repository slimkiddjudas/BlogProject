import express from 'express';
import {getAllPosts, getPostById, addPost, updatePost, deletePost} from '../controllers/post.controller.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', addPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;