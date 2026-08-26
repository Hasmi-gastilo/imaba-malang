require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorMiddleware = require('./middleware/errorMiddleware');
// Import Firebase Config
require('./config/firebase');

// Import routes
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const newsRoutes = require('./routes/newsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const programRoutes = require('./routes/programRoutes');
const kepengurusanRoutes = require('./routes/kepengurusanRoutes');
const homepageRoutes = require('./routes/homepageRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use('/api/', limiter);

// CORS - Allow Live Server (5500) and production
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/kepengurusan', kepengurusanRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    routes: ['/api/auth', '/api/members', '/api/news', '/api/events', '/api/programs', '/api/kepengurusan']
  });
});

// Serve HTML files - catch-all for SPA
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../public', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    }
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║        DPW IMABA MALANG - SERVER RUNNING         ║
  ║                                                   ║
  ║  Server: http://localhost:${PORT}                  ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
    `);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

module.exports = app;
