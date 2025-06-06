import { DataTypes } from "sequelize";
import db from "../config/db.js";
import slugify from "slugify";

const Post = db.define("Post", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // image: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    // },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: "view_count",
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Categories",
            key: "id",
        }
    },
},
{
    hooks: {
        beforeCreate: (post, options) => {
            if (post.title) {
                post.slug = slugify(post.title, { lower: true, strict: true });
            }
            post.createdAt = new Date();
        },
        beforeUpdate: (post, options) => {
            post.updatedAt = new Date();
        }
    },
});

// Associations
Post.associate = (models) => {
    Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "writer",
    });
    Post.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
    });
};

export default Post;