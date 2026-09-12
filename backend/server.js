const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

const cookieParser = require('cookie-parser');

// CORS Configuration
const allowedOrigins = [
    'https://brixxspace.com',
    'https://www.brixxspace.com',
    'https://brixxspace72.web.app',
    'https://brixxspace72.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const isAllowed = 
            allowedOrigins.includes(origin) ||
            /^https:\/\/([a-z0-9-]+\.)*brixxspace\.com$/.test(origin) ||
            /^https:\/\/([a-z0-9-]+\.)*web\.app$/.test(origin) ||
            /^https:\/\/([a-z0-9-]+\.)*firebaseapp\.com$/.test(origin) ||
            /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/.test(origin);

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Database connection middleware for Serverless / Express
app.use(async (req, res, next) => {
    try {
        if (process.env.NODE_ENV !== 'test') {
            await connectDB();
        }
        next();
    } catch (error) {
        console.error('Database connection error on request:', error.message);
        res.status(500).json({ message: 'Database connection error' });
    }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/user-projects', require('./routes/userProjectRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/service-categories', require('./routes/serviceCategoryRoutes'));
app.use('/api/service-subcategories', require('./routes/serviceSubcategoryRoutes'));
app.use('/api/project-categories', require('./routes/projectCategoryRoutes'));
app.use('/api/project-subcategories', require('./routes/projectSubcategoryRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/workers', require('./routes/workerRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/slider-images', require('./routes/sliderImageRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));

const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = parseInt(process.env.PORT) || 5001;

// Start server for Render / Local development / Standard hosting
const startServer = async (port) => {
    try {
        await connectDB();
        const server = app.listen(port, '0.0.0.0', () => {
            console.log(`Server running on port ${port}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use, trying ${Number(port) + 1}...`);
                startServer(Number(port) + 1);
            } else {
                console.error('Server error:', err);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Check if running inside Vercel serverless functions vs Render/Local server vs Test runner
if (process.env.VERCEL || process.env.NODE_ENV === 'test') {
    if (process.env.VERCEL) {
        connectDB().catch(err => {
            console.error('Failed to connect to MongoDB:', err.message);
        });
    }
} else {
    startServer(PORT);
}

// Export for Vercel serverless
module.exports = app;
