// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import adminRoutes from './routes/adminRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js'; // unified pharmacy routes
import { HTTP_STATUS } from './utils/httpStatus.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// Middleware
// ----------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ----------------------
// Routes
// ----------------------
app.use('/api/admin', adminRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/pharmacy', pharmacyRoutes); // all pharmacy endpoints under one route

// Health check / root
app.get('/', (req, res) => {
    res.status(HTTP_STATUS.OK).json({ message: 'Welcome to TsAcademy Group 4 Project' });
});

// ----------------------
// Start server
// ----------------------
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});