import express from 'express';
import post from './routes/post.route.js';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/post", post);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});