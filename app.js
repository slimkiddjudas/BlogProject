import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes/router.js';
import bodyParser from 'body-parser';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';
import sessionConfig from './middlewares/sessionConfig.js';
import { isAuth } from './middlewares/authMiddleware.js';
import { csrfProtection } from './middlewares/csrf.js';
import { getActiveUsers } from './sockets/userCountSocket.js';

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

app.get('/api/csrf-token', isAuth, csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/api/active-users', (req, res) => {
    res.json({ activeUsers: getActiveUsers() });
});

app.use('/static/', express.static('uploads'));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;