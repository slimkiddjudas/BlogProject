import { DataTypes } from "sequelize";
import db from "../config/db.js";
import slugify from "slugify";

const Announcement = db.define("Announcement", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
},
{
  hooks: {
    beforeCreate: (announcement, options) => {
        if (announcement.title) {
            announcement.slug = slugify(announcement.title, { lower: true, strict: true });
        }
        announcement.createdAt = new Date();
    },
    beforeUpdate: (announcement, options) => {
      if (announcement.title) {
        announcement.slug = slugify(announcement.title, { lower: true, strict: true });
      }
      announcement.updatedAt = new Date();
    },
  },
});

export default Announcement;
