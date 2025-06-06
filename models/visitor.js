import { DataTypes } from "sequelize";
import db from "../config/db.js";


const Visitor = db.define("Visitor", {
    visitCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        field: "visit_count",
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    hooks: {
        beforeCreate: (visitor, options) => {
            visitor.createdAt = new Date();
        },
        beforeUpdate: (visitor, options) => {
            visitor.updatedAt = new Date();
        }
    },
});

export default Visitor;