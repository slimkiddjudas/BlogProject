import data from '../data/mockPosts.js';

export const getAllPosts = (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const resultPosts = data.slice(startIndex, endIndex);
    res.json({
        totalPosts: data.length,
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        posts: resultPosts
    });
};

export const getPostById = (req, res) => {
    const { id } = req.params;
    const post = data.find((post) => post.id === parseInt(id));
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
};

export const addPost = async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    const newPost = {
        id: data.length + 1,
        title,
        content
    };
    data.push(newPost);
    await res.status(201).json(newPost);
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const postIndex = data.findIndex((post) => post.id === parseInt(id));
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    data[postIndex] = { id: parseInt(id), title, content };
    await res.json(data[postIndex]);
};

export const deletePost = async (req, res) => {
    const { id } = req.params;
    const postIndex = data.findIndex((post) => post.id === parseInt(id));
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }
    data.splice(postIndex, 1);
    await res.status(204).send();
};

export const searchPosts = (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    const filteredPosts = data.filter((post) => post.title.toLowerCase().includes(q.toLowerCase()));
    res.json(filteredPosts);
};
