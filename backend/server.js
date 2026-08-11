require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedCoreData } = require('./utils/seedData');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const harvestRoutes = require('./routes/harvestRoutes');
const marketRoutes = require('./routes/marketRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to Database & Auto-Seed Demo Records
connectDB().then(() => {
  seedCoreData();
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'AgriLink API Platform',
    tagline: 'Find the Best Market. Calculate the Real Return. Sell Smarter.',
    version: '1.0.0',
    status: 'ACTIVE',
    healthCheck: '/api/health',
    endpoints: {
      auth: '/api/auth',
      harvests: '/api/harvests',
      markets: '/api/markets',
      recommendations: '/api/recommendations',
      buyer: '/api/buyer',
      orders: '/api/orders',
      deliveries: '/api/deliveries',
      notifications: '/api/notifications',
      admin: '/api/admin',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'AgriLink Backend',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AgriLink Backend Server running on port ${PORT}`);
  console.log(`📡 Root Info:   http://localhost:${PORT}/`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
