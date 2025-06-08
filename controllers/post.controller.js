import models from '../models/index.js';

const { Post, User, Category } = models;

const addPost = async (req, res) => {
    try {
        const { title, content, categoryId } = req.body;
        const { userId } = req.session;

        let image = null;

        if (req.file) {
            image = req.file.path;
        }

        if (!title || !content || !categoryId) {
            return res.status(400).json({ message: "Title, content, and category ID are required" });
        }

        const post = await Post.create({
            title,
            content,
            image: image,
            userId,
            categoryId,
        });

        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const posts = await Post.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                { model: User, as: 'writer', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            totalPosts: posts.count,
            posts: posts.rows
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;
        const post = await Post.findOne({
            where: { id },
            include: [
                { model: User, as: 'writer', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ]
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await post.increment('viewCount');

        const isAuthor = post.userId === userId;
        res.status(200).json({
            post: {
                ...post.toJSON(),
                isAuthor
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({
            where: { slug },
            include: [
                { model: User, as: 'writer', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] },
            ]
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Increment view count
        await post.increment('viewCount');
        res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, categoryId } = req.body;
        const { userId } = req.session;

        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        if (title) post.title = title;
        if (content) post.content = content;
        if (categoryId) post.categoryId = categoryId;

        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        await post.destroy();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getPostsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const posts = await Post.findAndCountAll({
            where: { categoryId },
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                { model: User, as: 'writer', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalPosts: posts.count,
            posts: posts.rows
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getPostByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.findAll({
            where: { userId },
            include: [
                { model: User, as: 'writer', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalPosts: posts.length,
            posts
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export {
    addPost,
    getPosts,
    getPostById,
    getPostBySlug,
    updatePost,
    deletePost,
    getPostsByCategory,
    getPostByUser
};