const isAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
}

const isAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'admin') {
        return next();
    }
    return res.status(403).json({ message: "Forbidden" });
}

const isWriter = (req, res, next) => {
    if (req.session && (req.session.userRole === 'writer' || req.session.userRole === 'admin')) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden" });
}

export { isAuth, isAdmin, isWriter };