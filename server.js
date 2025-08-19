const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const apiRoutes = require('./routes/route'); // Mengimpor rute


const app = express();
const PORT = 3010;

// Gunakan middleware CORS
app.use(cors({
    origin: '*'
}));

app.use(cors({
    origin: '*', // Izinkan semua origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware untuk log CORS
app.use((req, res, next) => {
    console.log('CORS Middleware Applied');
    next();
});

app.options('*', cors()); // Handle preflight requests

app.use(bodyParser.json());
app.use(cors());

// Menggunakan rute
app.use('/api', apiRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync({ alter: true }); // Synchronize models with database
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
});
