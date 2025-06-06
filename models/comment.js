import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Comment = db.define("Comment", {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
        field: "user_id",
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Posts",
            key: "id",
        },
        field: "post_id",
    },
},
{
    hooks: {
        beforeCreate: (comment, options) => {
            comment.createdAt = new Date();
        },
        beforeUpdate: (comment, options) => {
            comment.updatedAt = new Date();
        }
    },
});

// Associations
Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "writer",
    });
    Comment.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
    });
};

export default Comment;