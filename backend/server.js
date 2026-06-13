const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const path = require('path');
const fs = require('fs');

// Allow all origins (needed for Cloudflare tunnel)
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.use('/api', apiRoutes);

// Serve frontend build (React SPA)
const frontendBuild = path.join(__dirname, '../frontend/build');

if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  // SPA fallback — Express 5 compatible wildcard
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/assets')) {
      const indexFile = path.join(frontendBuild, 'index.html');
      if (fs.existsSync(indexFile)) {
        return res.sendFile(indexFile);
      }
    }
    next();
  });
  console.log('✅ Serving frontend from:', frontendBuild);
} else {
  console.warn('⚠️  Frontend build not found at:', frontendBuild);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
