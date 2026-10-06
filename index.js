const { rateLimit } = require('express-rate-limit');
const express = require('express')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()
const port = process.env.PORT

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
})


app.get('/', (req, res) => {
    res.send("your stupid")
})

// Create the limiter once when the application starts.
const spotsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,              // Allow 100 requests per client IP/window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Request limit reached. Please try again later.',
  },
});

// Run the limiter before the database handler.
app.get('/getSpots', spotsLimiter, (req, res) => {
  connection.query('SELECT * FROM Spots', (error, results) => {
    if (error) {
      console.error('GET /getSpots database error:', error.code);

      return res.status(500).json({
        error: 'Unable to retrieve spots.',
      });
    }

    return res.json(results);
  });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
