import db from '../config/db.js';
import { posts } from '../models/post.model.js';
import { eq, desc, sql, ilike } from 'drizzle-orm';

export const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'newest' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        
        // Tüm postları sayısını al
        const allPosts = await db.select().from(posts);
        const totalPosts = allPosts.length;
        
        // Sıralama kriterini belirle
        let query = db.select().from(posts);
        
        // Sıralama seçenekleri
        if (sort === 'newest') {
            query = query.orderBy(desc(posts.createdAt));
        } else if (sort === 'oldest') {
            query = query.orderBy(posts.createdAt);
        } else if (sort === 'updated') {
            query = query.orderBy(desc(posts.updatedAt));
        } else if (sort === 'title') {
            query = query.orderBy(posts.title);
        }
        
        // Pagination uygula
        query = query.limit(limitNum).offset(offset);
        
        // Sorguyu çalıştır
        const resultPosts = await query;
            
        res.json({
            totalPosts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalPosts / limitNum),
            posts: resultPosts
        });
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ 
            message: 'Error fetching posts', 
            error: error.message 
        });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id);
        
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        
        const post = await db
            .select()
            .from(posts)
            .where(eq(posts.id, postId))
            .limit(1);
            
        if (!post.length) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post[0]);
    } catch (error) {
        console.error('Fetch post error:', error);
        res.status(500).json({ 
            message: 'Error fetching post', 
            error: error.message 
        });
    }
};

export const addPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // Post içeriğini kontrol et
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        // Kullanıcı ID'sini al
        const authorId = req.user?.id;
        
        if (!authorId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const now = new Date();
        
        const newPost = await db.insert(posts)
            .values({
                title: title.trim(),
                content: content.trim(),
                authorId,
                createdAt: now,
                updatedAt: now
            })
            .returning();
            
        res.status(201).json(newPost[0]);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ 
            message: 'Error creating post', 
            error: error.message 
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id);
        
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        
        const { title, content } = req.body;
        
        // Post içeriğini kontrol et
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        
        // Kullanıcı ID'sini al
        const authorId = req.user?.id;
        
        if (!authorId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        // Post varlığını kontrol et
        const existingPost = await db
            .select()
            .from(posts)
            .where(eq(posts.id, postId))
            .limit(1);
            
        if (!existingPost.length) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Kullanıcının post sahibi olup olmadığını kontrol et
        if (existingPost[0].authorId !== authorId) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }
        
        // Post'u güncelle, ancak createdAt değerini koruyarak
        const createdAt = existingPost[0].createdAt;
        
        const updatedPost = await db.update(posts)
            .set({
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date(),
                // Önemli: createdAt değerini güncelleme
                createdAt: createdAt
            })
            .where(eq(posts.id, postId))
            .returning();
            
        res.json(updatedPost[0]);
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ 
            message: 'Error updating post', 
            error: error.message 
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id);
        
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        
        // Kullanıcı ID'sini al
        const authorId = req.user?.id;
        
        if (!authorId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        // Post varlığını kontrol et
        const existingPost = await db
            .select()
            .from(posts)
            .where(eq(posts.id, postId))
            .limit(1);
            
        if (!existingPost.length) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Kullanıcının post sahibi olup olmadığını kontrol et
        if (existingPost[0].authorId !== authorId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        // Post'u sil
        await db.delete(posts)
            .where(eq(posts.id, postId));
            
        res.status(204).send();
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ 
            message: 'Error deleting post', 
            error: error.message 
        });
    }
};

export const searchPosts = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        
        if (!q?.trim()) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const searchTerm = `%${q.trim()}%`;
        
        // Önce toplam eşleşen post sayısını bul
        const allFilteredPosts = await db
            .select()
            .from(posts)
            .where(ilike(posts.title, searchTerm));
            
        const totalFilteredPosts = allFilteredPosts.length;
        
        // Arama yap ve sırala
        const filteredPosts = await db
            .select()
            .from(posts)
            .where(ilike(posts.title, searchTerm))
            .orderBy(desc(posts.createdAt))
            .limit(limitNum)
            .offset(offset);
            
        res.json({
            totalPosts: totalFilteredPosts,
            currentPage: pageNum, 
            totalPages: Math.ceil(totalFilteredPosts / limitNum),
            posts: filteredPosts
        });
    } catch (error) {
        console.error('Search posts error:', error);
        res.status(500).json({ 
            message: 'Error searching posts', 
            error: error.message 
        });
    }
};
