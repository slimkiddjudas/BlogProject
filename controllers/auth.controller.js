import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Gerekli alanları kontrol et
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Kullanıcı adı veya email zaten kullanılıyor mu kontrol et
        const userExists = users.find(user => 
            user.username === username || user.email === email
        );

        if (userExists) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }

        // Şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Yeni kullanıcı oluştur
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Kullanıcıyı kaydet
        users.push(newUser);

        // JWT token oluştur
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Yanıt gönder (şifreyi hariç tut)
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
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
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Kullanıcıyı bul
        const user = users.find(user => user.username === username);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Yanıt gönder (şifreyi hariç tut)
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login',
            error: error.message 
        });
    }
};

export const getProfile = (req, res) => {
    // Bu endpoint yetkilendirme gerektirir, kullanıcı bilgilerini req.user'dan al
    const { user } = req;
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    res.json({
        success: true,
        user
    });
};