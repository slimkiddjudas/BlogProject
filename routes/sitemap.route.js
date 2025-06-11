import express from 'express';
import { generateSitemap } from '../controllers/sitemap.controller.js';

const router = express.Router();

router.get('/', generateSitemap);

export default router;
