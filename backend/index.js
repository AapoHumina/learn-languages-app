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

app.use("/api/worddb", router);


// Create a table and insert data
db.serialize(() => {
    // Create the table
    db.run('CREATE TABLE IF NOT EXISTS worddb (id INTEGER PRIMARY KEY, finnish_word VARCHAR, english_word VARCHAR)', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            return;
        }

        // Insert data after table creation
        db.run('INSERT INTO worddb (finnish_word, english_word) VALUES (?, ?)', ["koira", "dog"]);
        db.run('INSERT INTO worddb (finnish_word, english_word) VALUES (?, ?)', ["kissa", "cat"]);
        db.run('INSERT INTO worddb (finnish_word, english_word) VALUES (?, ?)', ["koti", "home"]);
        db.run('INSERT INTO worddb (finnish_word, english_word) VALUES (?, ?)', ["joulu", "christmas"]);
    });
});

// Define the route to get all locations
const getAllWords = (req, res) => {
    // Query the data
    db.all('SELECT * FROM worddb ORDER BY id ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Send the rows as a JSON response
    });
};

router.get('/', getAllWords);

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