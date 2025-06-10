import models from '../models/index.js';

const { Post, Category, Announcement } = models;

const generateSitemap = async (req, res) => {
    try {
        // Statik sayfalar - Frontend yapısına göre güncellenmiş
        const staticPages = [
            // Ana sayfa ve genel sayfalar
            { url: 'http://localhost:5173/', priority: '1.0', changefreq: 'daily' },
            { url: 'http://localhost:5173/profile', priority: '0.6', changefreq: 'weekly' },
            { url: 'http://localhost:5173/gallery', priority: '0.8', changefreq: 'weekly' },
            { url: 'http://localhost:5173/announcements', priority: '0.8', changefreq: 'daily' },
            { url: 'http://localhost:5173/sitemap', priority: '0.5', changefreq: 'monthly' },
            
            // Kimlik doğrulama sayfaları
            { url: 'http://localhost:5173/login', priority: '0.7', changefreq: 'monthly' },
            { url: 'http://localhost:5173/register', priority: '0.7', changefreq: 'monthly' },
            
            // Admin paneli sayfaları
            { url: 'http://localhost:5173/admin', priority: '0.3', changefreq: 'weekly' },
            { url: 'http://localhost:5173/admin/users', priority: '0.2', changefreq: 'weekly' },
            { url: 'http://localhost:5173/admin/posts', priority: '0.2', changefreq: 'weekly' },
            { url: 'http://localhost:5173/admin/categories', priority: '0.2', changefreq: 'weekly' },
            { url: 'http://localhost:5173/admin/announcements', priority: '0.2', changefreq: 'weekly' },
            { url: 'http://localhost:5173/admin/gallery', priority: '0.2', changefreq: 'weekly' },
            
            // Yazar paneli sayfaları
            { url: 'http://localhost:5173/writer', priority: '0.3', changefreq: 'weekly' },
            { url: 'http://localhost:5173/writer/posts', priority: '0.3', changefreq: 'weekly' },
            { url: 'http://localhost:5173/writer/posts/new', priority: '0.2', changefreq: 'monthly' },
        ];        // Dinamik postlar
        const posts = await Post.findAll({
            attributes: ['id', 'slug', 'updatedAt'],
            order: [['updatedAt', 'DESC']]
        });

        // Dinamik duyurular
        const announcements = await Announcement.findAll({
            attributes: ['id', 'slug', 'updatedAt'],
            order: [['updatedAt', 'DESC']]
        });

        // Dinamik kategoriler - Yalnızca referans için (frontend'de kategori sayfası yok)
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
        });        // Postları ekle
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

        // Duyuruları ekle
        announcements.forEach(announcement => {
            const lastmod = new Date(announcement.updatedAt).toISOString().split('T')[0];
            sitemap += `
    <url>
        <loc>http://localhost:5173/announcements/${announcement.slug}</loc>
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
