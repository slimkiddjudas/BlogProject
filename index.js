import express from 'express';
import post from './routes/post.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/post", post);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});