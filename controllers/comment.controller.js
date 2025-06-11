import models from '../models/index.js';
const { User, Category, Comment, Post } = models;

const addComment = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const { userId } = req.session;

        if (!content || !postId) {
            return res.status(400).json({ message: "Content and Post ID are required" });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = await Comment.create({
            content,
            userId,
            postId
        });

        return res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.findAll({
            where: { postId },
            include: [
                { model: User, as: 'writer', attributes: ['id', 'firstName', 'lastName'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (comments.length === 0) {
            return res.status(404).json({ message: "No comments found for this post" });
        }

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req.session;
        
        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await comment.destroy();
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req.session;

        const { content } = req.body;
        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to update this comment" });
        }

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export {
    addComment,
    getCommentsByPostId,
    deleteComment,
    updateComment
};