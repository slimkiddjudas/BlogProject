import express from 'express';
import authRouter from './auth.route.js';
import postRouter from './post.route.js';
import categoryRouter from './category.route.js';
import commentRouter from './comment.route.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/comments', commentRouter);

router.get('/', (req, res) => {
    res.send('API is running');
});

export default router;