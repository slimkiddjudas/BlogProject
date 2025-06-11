import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes/router.js';
import bodyParser from 'body-parser';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';
import sessionConfig from './middlewares/sessionConfig.js';
import { isAuth } from './middlewares/authMiddleware.js';
import { csrfProtection } from './middlewares/csrf.js';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionConfig);

app.use("/static/images", express.static(path.join(__dirname, 'uploads')));

// Statik sitemap dosyasını serve et
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/api/csrf-token', isAuth, csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;