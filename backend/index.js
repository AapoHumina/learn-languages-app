const express = require('express');
const app = express();
const worddbRoutes = require('./routes/worddbRoutes');
const cors = require('cors');

//const port = 3000
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicitly allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

// Explicitly handle OPTIONS requests for preflight
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204); // Respond with 204 No Content
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