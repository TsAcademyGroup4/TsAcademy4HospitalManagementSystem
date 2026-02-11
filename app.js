// Load environment variables from .env
// require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// Middleware
// ----------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to TsAcademy Group 4 Project' });
});

app.listen(PORT, () => {
    console.log(`Server running on port 5000`);
});
