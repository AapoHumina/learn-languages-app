const express = require('express')
const app = express();
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');
//const port = 3000
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api/locations", router);


// Create a table and insert data
db.serialize(() => {
    // Create the table
    db.run('CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, latitude DECIMAL(9,6), longitude DECIMAL(9,6))', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            return;
        }

        // Insert data after table creation
        db.run('INSERT INTO locations (latitude, longitude) VALUES (?, ?)', [60, 60]);
        db.run('INSERT INTO locations (latitude, longitude) VALUES (?, ?)', [70, 70]);
        db.run('INSERT INTO locations (latitude, longitude) VALUES (?, ?)', [80, 80]);
    });
});

// Define the route to get all locations
const getAllLocations = (req, res) => {
    // Query the data
    db.all('SELECT * FROM locations ORDER BY id ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Send the rows as a JSON response
    });
};

router.get('/', getAllLocations);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

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