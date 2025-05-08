import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { users } from '../models/user.model.js';
import { eq, or } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES;

// Token oluşturma fonksiyonu
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES }
  );
};

// Şifre olmadan kullanıcı nesnesini döndüren yardımcı fonksiyon
const getUserWithoutPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Gerekli alanların varlığını ve formatını kontrol et
        if (!username?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Email formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Kullanıcı adı ve şifre uzunluğunu kontrol et
        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Username must be between 3 and 50 characters'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Kullanıcı adı veya email zaten kullanılıyor mu kontrol et
        const existingUser = await db.select()
            .from(users)
            .where(or(
                eq(users.username, username.trim()),
                eq(users.email, email.trim())
            ))
            .limit(1);

        if (existingUser.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }

        // Şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const now = new Date();

        // Yeni kullanıcı oluştur
        const newUser = await db.insert(users)
            .values({
                username: username.trim(),
                email: email.trim(),
                password: hashedPassword,
                createdAt: now,
                updatedAt: now
            })
            .returning();

        // JWT token oluştur
        const token = generateToken(newUser[0]);

        // Yanıt gönder (şifreyi hariç tut)
        const userWithoutPassword = getUserWithoutPassword(newUser[0]);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration',
            error: error.message 
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Gerekli alanları kontrol et
        if (!username?.trim() || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Kullanıcıyı bul
        const user = await db.select()
            .from(users)
            .where(eq(users.username, username.trim()))
            .limit(1);

        if (user.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // JWT token oluştur
        const token = generateToken(user[0]);

        // Son giriş tarihini güncelle
        await db.update(users)
            .set({ updatedAt: new Date() })
            .where(eq(users.id, user[0].id));

        // Yanıt gönder (şifreyi hariç tut)
        const userWithoutPassword = getUserWithoutPassword(user[0]);
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login',
            error: error.message 
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        // Kullanıcıyı veritabanından getir
        const user = await db.select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Şifreyi çıkar
        const userWithoutPassword = getUserWithoutPassword(user[0]);
        
        res.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }
        
        // Kullanıcıyı veritabanından getir
        const user = await db.select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Mevcut şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Yeni şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Şifreyi güncelle
        await db.update(users)
            .set({ 
                password: hashedPassword,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        const { email } = req.body;
        
        if (!email?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        
        // Email formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Email zaten kullanılıyor mu kontrol et (kendisi hariç)
        const existingUser = await db.select()
            .from(users)
            .where(
                eq(users.email, email.trim())
            )
            .limit(1);
        
        if (existingUser.length > 0 && existingUser[0].id !== userId) {
            return res.status(409).json({
                success: false,
                message: 'Email already in use'
            });
        }
        
        // Profili güncelle
        const updatedUser = await db.update(users)
            .set({ 
                email: email.trim(),
                updatedAt: new Date()
            })
            .where(eq(users.id, userId))
            .returning();
        
        // Şifreyi çıkar
        const userWithoutPassword = getUserWithoutPassword(updatedUser[0]);
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};