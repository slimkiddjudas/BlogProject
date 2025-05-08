import express from 'express';
import post from './routes/post.route.js';
import auth from './routes/auth.route.js';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Veritabanı migrasyonlarını uygula
// const migrateDb = async () => {
//   try {
//     console.log('Running migrations...');
//     await migrate(db, { migrationsFolder: './migrations' });
//     console.log('Migrations completed successfully');
//   } catch (error) {
//     console.error('Migration error:', error);
//     process.exit(1);
//   }
// };

// // Veritabanı migrasyonlarını başlat
// migrateDb();

// Middleware'ler
app.use(express.json());

// Route'lar
app.use("/post", post);
app.use("/auth", auth);

// Hata yakalama middleware'leri
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});