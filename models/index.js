import User from './user.js';
import Post from './post.js';
import Category from './category.js';
import Comment from './comment.js';
import Gallery from './gallery.js';
import Announcement from './announcement.js';

const models = {
    User,
    Post,
    Category,
    Comment,
    Gallery,
    Announcement,
};

Object.values(models).forEach(model => {
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

export default models;