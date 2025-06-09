import models from "../models/index.js";

const { Announcement } = models;

const addAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const announcement = await Announcement.create({
            title,
            content,
        });

        res.status(201).json({ message: "Announcement created successfully", announcement });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const announcements = await Announcement.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalAnnouncements: announcements.count,
            announcements: announcements.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const announcement = await Announcement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        announcement.title = title;
        announcement.content = content;
        await announcement.save();

        res.status(200).json({ message: "Announcement updated successfully", announcement });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        await announcement.destroy();
        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findByPk(id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAnnouncementBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const announcement = await Announcement.findOne({ where: { slug } });
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    addAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementById,
    getAnnouncementBySlug
};