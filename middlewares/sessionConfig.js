import session from "express-session";
import db from "../config/db.js";
import SequelizeStore from "connect-session-sequelize";

const sessionStore = SequelizeStore(session.Store);

const sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    },
    store: new sessionStore({
        db: db
    }),
});

export default sessionConfig;