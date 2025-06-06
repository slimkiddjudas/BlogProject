import { DataTypes } from "sequelize";
import db from "../config/db.js";

const PostImage = db.define("PostImage", {
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Posts",
            key: "id",
        },
    },
});

PostImage.associate = (models) => {
    PostImage.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
    });
};

export default PostImage;
