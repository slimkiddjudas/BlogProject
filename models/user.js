import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const User = db.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    }
  },
  role: {
    type: DataTypes.ENUM("admin", "user", "writer"),
    allowNull: false,
    defaultValue: "user",
  },
},
{
  hooks: {
    beforeCreate: (user, options) => {
      if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
      }
    },
    beforeUpdate: (user, options) => {
      if (user.changed("password")) {
        user.password = bcrypt.hashSync(user.password, 10);
      }
    }
  }
},
{
  timestamps: true,
});

// Associations
User.associate = (models) => {
  User.hasMany(models.Post, {
    foreignKey: "userId",
    as: "posts",
    onDelete: "CASCADE",
  });
  User.hasMany(models.Comment, {
    foreignKey: "userId",
    as: "comments",
    onDelete: "CASCADE",
  });
};

// Instance methods
User.prototype.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
User.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

export default User;