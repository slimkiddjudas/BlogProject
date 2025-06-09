import models from "../models/index.js";
const { Gallery } = models;

const addGalleryItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    let image = null;
    if (req.file) {
      image = req.file.path;
    }
    const galleryItem = await Gallery.create({
      title,
      description,
      imageUrl: image,
    });
    return res
      .status(201)
      .json({ message: "Gallery item created successfully", galleryItem });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(galleryItems);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const galleryItem = await Gallery.findByPk(id);
        if (!galleryItem) {
        return res.status(404).json({ message: "Gallery item not found" });
        }
        await galleryItem.destroy();
        return res.status(200).json({ message: "Gallery item deleted successfully" });
    } catch (error) {
        return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
};

export { addGalleryItem, getGalleryItems, deleteGalleryItem };
