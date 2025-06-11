import express from 'express';
import {addAnnouncement, getAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement, getAnnouncementBySlug} from '../controllers/announcement.controller.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { csrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

router.post('/', isAuth, isAdmin, csrfProtection, addAnnouncement);
router.get('/', isAuth, getAnnouncements);
router.get('/:id', isAuth, getAnnouncementById);
router.put('/:id', isAuth, isAdmin, csrfProtection, updateAnnouncement);
router.delete('/:id', isAuth, isAdmin, csrfProtection, deleteAnnouncement);
router.get('/slug/:slug', isAuth, getAnnouncementBySlug);


export default router;