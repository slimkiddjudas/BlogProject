import models from '../models/index.js';

const { Post, Category } = models;

const generateSitemap = async (req, res) => {
    try {
        // Statik sayfalar
        const staticPages = [
            { url: 'http://localhost:5173/', priority: '1.0', changefreq: 'daily' },
            { url: 'http://localhost:5173/login', priority: '0.8', changefreq: 'monthly' },
            { url: 'http://localhost:5173/register', priority: '0.8', changefreq: 'monthly' },
            { url: 'http://localhost:5173/blog', priority: '0.9', changefreq: 'daily' },
            { url: 'http://localhost:5173/categories', priority: '0.7', changefreq: 'weekly' },
            { url: 'http://localhost:5173/about', priority: '0.6', changefreq: 'monthly' },
            { url: 'http://localhost:5173/contact', priority: '0.6', changefreq: 'monthly' },
            { url: 'http://localhost:5173/profile', priority: '0.5', changefreq: 'weekly' },
            { url: 'http://localhost:5173/admin', priority: '0.4', changefreq: 'weekly' },
            { url: 'http://localhost:5173/writer', priority: '0.4', changefreq: 'weekly' },
        ];

        // Dinamik postlar
        const posts = await Post.findAll({
            attributes: ['id', 'slug', 'updatedAt'],
            order: [['updatedAt', 'DESC']]
        });

        // Dinamik kategoriler
        const categories = await Category.findAll({
            attributes: ['id', 'name', 'updatedAt']
        });

        const currentDate = new Date().toISOString().split('T')[0];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Statik sayfaları ekle
        staticPages.forEach(page => {
            sitemap += `
    <url>
        <loc>${page.url}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
        });

        // Postları ekle
        posts.forEach(post => {
            const lastmod = new Date(post.updatedAt).toISOString().split('T')[0];
            sitemap += `
    <url>
        <loc>http://localhost:5173/post/${post.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });

        // Kategorileri ekle
        categories.forEach(category => {
            const lastmod = new Date(category.updatedAt).toISOString().split('T')[0];
            sitemap += `
    <url>
        <loc>http://localhost:5173/category/${category.name.toLowerCase().replace(/\s+/g, '-')}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
        });

        sitemap += `
</urlset>`;

        res.set('Content-Type', 'text/xml');
        res.send(sitemap);

    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).json({ message: 'Sitemap generation failed', error: error.message });
    }
};

export { generateSitemap };
