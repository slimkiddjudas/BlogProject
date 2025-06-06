import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Category = db.define("Category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

Category.associate = (models) => {
    Category.hasMany(models.Post, {
        foreignKey: "categoryId",
        as: "posts",
        onDelete: "CASCADE",
    });
};

export default Category;
