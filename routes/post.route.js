import express from 'express';
import {getAllPosts, getPostById, addPost, updatePost, deletePost, searchPosts} from '../controllers/post.controller.js';

const router = express.Router();

// ID doğrulama middleware'i
const validateIdParam = (req, res, next) => {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: 'Invalid ID format. ID must be an integer.' });
    }
    next();
};

router.get('/', getAllPosts);
router.get('/search', searchPosts); // Özel route'ları daha spesifik parametrelere sahip route'lardan önce tanımlayın
router.get('/:id', validateIdParam, getPostById); // ID doğrulama middleware'i ekledik
router.post('/', addPost);
router.put('/:id', validateIdParam, updatePost);
router.delete('/:id', validateIdParam, deletePost);

export default router;