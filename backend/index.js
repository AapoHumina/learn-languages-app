const express = require('express');
const app = express();
const worddbRoutes = require('./routes/worddbRoutes');
const cors = require('cors');

//const port = 3000
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Middleware to handle CORS
app.use(cors({
    origin: '*', // Allow all origins (adjust as needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, headers)
    preflightContinue: false, // Don't pass the preflight request to the next handler
    optionsSuccessStatus: 204 // Handle preflight responses with status 204
}));

// Handle preflight request (OPTIONS) explicitly if needed
app.use((req, res, next) => {
    // Allow private network requests if needed
    res.header('Access-Control-Allow-Private-Network', 'true');
    next();
});

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Private-Network', 'true'); // For private network resources
    res.sendStatus(204); // Respond with 204 No Content for OPTIONS request
});

app.use("/api/worddb", worddbRoutes);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Handle SIGINT (Ctrl+C) for graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down...');

    // Close the server instance gracefully
    server.close(() => {
        console.log('Server closed.');
        process.exit(0); // Exit the process with code 0 (success)
    });
});