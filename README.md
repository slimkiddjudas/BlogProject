# Blog Project Backend

A full-featured blog backend API built with Node.js, Express.js, and PostgreSQL. This server provides comprehensive functionality for a modern blog platform with real-time features, user management, content management, and administrative capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: Session-based auth with role-based access control (admin, writer, reader)
- **Blog Management**: Create, read, update, delete blog posts with categories and tags
- **Comment System**: Nested commenting with moderation capabilities
- **File Upload**: Image upload and management for posts and galleries
- **Real-time Features**: WebSocket integration for live user count and real-time updates
- **Content Management**: Categories, announcements, and gallery management
- **SEO Optimization**: Automatic sitemap generation and slug management

### Security Features
- CSRF protection
- Session management with secure cookies
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization

### Performance & Scalability
- Database connection pooling
- Efficient query optimization with Sequelize ORM
- File upload handling with Multer
- Error handling and logging

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Express Session with bcrypt
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: CORS, CSRF, Cookie Parser
- **Development**: Nodemon, Drizzle Kit

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BlogProjectBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=5432
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Security
   SESSION_SECRET=your_session_secret_key
   COOKIE_SECRET=your_cookie_secret_key
   ```

4. **Database Setup**
   ```bash
   # Generate database migrations
   npm run generate
   
   # Run migrations
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm start
   
   # Or use Drizzle Studio for database management
   npm run studio
   ```

## 📁 Project Structure

```
BlogProjectBackend/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── package.json          # Dependencies and scripts
├── config/
│   └── db.js             # Database connection setup
├── controllers/          # Route handlers and business logic
│   ├── announcement.controller.js
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── comment.controller.js
│   ├── gallery.controller.js
│   ├── post.controller.js
│   └── sitemap.controller.js
├── middlewares/          # Custom middleware functions
│   ├── authMiddleware.js      # Authentication & authorization
│   ├── csrf.js               # CSRF protection
│   ├── errorMiddleware.js    # Error handling
│   ├── fileUploadMiddleware.js # File upload handling
│   └── sessionConfig.js     # Session configuration
├── models/               # Database models (Sequelize)
│   ├── index.js         # Model associations
│   ├── announcement.js
│   ├── category.js
│   ├── comment.js
│   ├── gallery.js
│   ├── post.js
│   └── user.js
├── routes/               # API route definitions
│   ├── router.js        # Main router
│   ├── announcement.route.js
│   ├── auth.route.js
│   ├── category.route.js
│   ├── comment.route.js
│   ├── gallery.route.js
│   ├── post.route.js
│   └── sitemap.route.js
├── sockets/              # WebSocket handlers
│   └── userCountSocket.js
├── public/               # Static files
│   └── sitemap.xml
└── uploads/              # User uploaded files
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user info
- `PUT /change-password` - Change user password
- `PUT /update-profile` - Update user profile
- `PUT /change-role` - Change user role (Admin only)
- `GET /users` - Get all users (Admin only)

### Posts (`/api/posts`)
- `GET /` - Get all posts (with pagination and filtering)
- `GET /:id` - Get single post
- `POST /` - Create new post (Writer/Admin)
- `PUT /:id` - Update post (Writer/Admin)
- `DELETE /:id` - Delete post (Writer/Admin)

### Categories (`/api/categories`)
- `GET /` - Get all categories
- `POST /` - Create category (Admin)
- `PUT /:id` - Update category (Admin)
- `DELETE /:id` - Delete category (Admin)

### Comments (`/api/comments`)
- `GET /post/:postId` - Get comments for a post
- `POST /` - Create comment (Authenticated users)
- `PUT /:id` - Update comment (Comment owner/Admin)
- `DELETE /:id` - Delete comment (Comment owner/Admin)

### Gallery (`/api/gallery`)
- `GET /` - Get gallery images
- `POST /` - Upload new image (Writer/Admin)
- `DELETE /:id` - Delete image (Writer/Admin)

### Announcements (`/api/announcements`)
- `GET /` - Get all announcements
- `POST /` - Create announcement (Admin)
- `PUT /:id` - Update announcement (Admin)
- `DELETE /:id` - Delete announcement (Admin)

### Sitemap (`/api/sitemap`)
- `GET /generate` - Generate XML sitemap

## 🔐 User Roles & Permissions

### Admin
- Full access to all features
- User management and role assignment
- Content moderation and management
- System configuration

### Writer
- Create, edit, and delete own posts
- Manage categories and gallery
- Moderate comments on own posts

### Reader (Default)
- View public content
- Create and manage own comments
- Update own profile

## 🌐 Real-time Features

The application uses Socket.IO for real-time functionality:

- **Live User Count**: Tracks and broadcasts the number of active users
- **Real-time Updates**: Instant notifications for new content
- **Connection Management**: Handles user connections and disconnections

### Socket Events
- `userLogin` - User authentication event
- `activeUsersCount` - Broadcasts current active user count
- `disconnect` - Handles user disconnection

## 🛡️ Security Measures

- **Session-based Authentication**: Secure session management with httpOnly cookies
- **CSRF Protection**: Cross-Site Request Forgery protection for state-changing operations
- **Password Security**: Bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive input validation using Express Validator
- **Role-based Access Control**: Granular permissions based on user roles
- **CORS Configuration**: Properly configured Cross-Origin Resource Sharing
- **File Upload Security**: Secure file handling with type and size restrictions

## 🗄️ Database Schema

### Users
- Authentication and profile information
- Role-based permissions (admin, writer, reader)
- Password hashing and validation

### Posts
- Title, content, image, and metadata
- SEO-friendly slugs and view tracking
- Author association and category linking

### Categories
- Hierarchical category system
- Post categorization and filtering

### Comments
- Nested comment structure
- User association and moderation flags

### Gallery
- Image management and organization
- File metadata and associations

### Announcements
- Site-wide announcements and notifications
- Admin-controlled content management

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_SSL=true
SESSION_SECRET=strong_production_secret
COOKIE_SECRET=strong_production_cookie_secret
```

### Production Considerations
- Enable SSL/HTTPS for secure connections
- Configure PostgreSQL for production workloads
- Set up proper logging and monitoring
- Configure reverse proxy (nginx/Apache)
- Enable database SSL connections
- Set secure session and cookie configurations

## 🧪 Development

### Available Scripts
- `npm start` - Start development server with auto-reload
- `npm run generate` - Generate database migrations
- `npm run migrate` - Run database migrations
- `npm run studio` - Open Drizzle Studio for database management

### Database Management
The project uses Sequelize ORM with automatic model synchronization. For production, use proper migrations instead of `sync({ alter: true })`.

## 📝 API Documentation

The API follows RESTful conventions with consistent response formats:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 🐛 Known Issues

- File upload size limits may need adjustment for large images
- Session store cleanup for expired sessions needs implementation
- Rate limiting not implemented (consider adding for production)

## 🔮 Future Enhancements

- Email notification system
- Advanced search functionality
- Content caching with Redis
- API rate limiting
- Advanced analytics and reporting
- Multi-language support
- Social media integration

## 📞 Support

For support and questions, please create an issue in the repository or contact the development team.
