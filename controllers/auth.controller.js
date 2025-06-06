import models from '../models/index.js';
const { User, Category, Comment, Post } = models;

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        return res.status(201).json({ message: "User registered successfully", user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        }});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = user.verifyPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.fullName = user.getFullName();

        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 gün
        }

        return res.status(200).json({ message: "Login successful", user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successful" });
    });
};

const getCurrentUser = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findByPk(req.session.userId, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        });
        
        if (!user) {
            req.session.destroy();
            return res.status(401).json({ message: "User not found" });
        }
        
        return res.status(200).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export {
    register,
    login,
    logout,
    getCurrentUser,
};