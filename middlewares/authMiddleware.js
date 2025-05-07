import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const authMiddleware = (req, res, next) => {
    // Authorization header'ı kontrol et
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided'
        });
    }

    // Token'ı al
    const token = authHeader.split(' ')[1];

    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Kullanıcı bilgilerini request nesnesine ekle
        req.user = {
            id: decoded.id,
            username: decoded.username
        };
        
        // Bir sonraki middleware'e geç
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};