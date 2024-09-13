require('dotenv').config()
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const router = require('./router/index')
const sequelize = require('./config/database')

const app = express()
const port = process.env.PORT || 3000

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
})

app.use(express.json());

app.use(cors());

app.use('/api', router, limiter)

const startServer = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection to the database has been established successfully.');

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        });
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

startServer();

