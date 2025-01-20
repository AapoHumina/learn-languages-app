const express = require('express');
const app = express();
const worddbRoutes = require('./routes/worddbRoutes');
const cors = require('cors');

//const port = 3000
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(cors());

// Middleware to handle CORS preflight requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');  // Or set a specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Allow specific methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Allow specific headers
    res.header('Access-Control-Allow-Private-Network', 'true');  // Allow private network requests

    // Handle preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
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