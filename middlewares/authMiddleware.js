import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
    let token;
    
    // Token'ı headerdan al
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
    
    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Kullanıcıyı veritabanından getir
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, decoded.id))
            .limit(1);
            
        if (user.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }
        
        // Şifreyi çıkar
        const { password: _, ...userWithoutPassword } = user[0];
        
        // Request'e kullanıcı bilgilerini ekle
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
};