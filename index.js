import http from 'http';
import app from './app.js';
import db from './config/db.js';
import { userCountSocket } from './sockets/userCountSocket.js';
import dotenv from 'dotenv';
import models from './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await db.sync({ alter: true });
        console.log('Veritabanı bağlantısı başarılı.');
        const server = http.createServer(app);
        userCountSocket(server);

        const adminUser = await models.User.findOne({ where: { role: 'admin' } });
        if (!adminUser) {
            console.log('Admin kullanıcısı bulunamadı, yeni admin kullanıcısı oluşturuluyor...');
            await models.User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@mail.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        server.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda çalışıyor.`);
        });
    } catch (error) {
        console.error('Sunucu başlatılırken hata oluştu:', error);
        process.exit(1);
    }
}

startServer();
