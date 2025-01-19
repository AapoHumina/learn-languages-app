const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Create a table and insert data
// serialize makes it so its made line by line in order
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

const getAllWords = (_req, res) => {
    // db.all
    // "Runs the SQL query with the specified parameters and calls the callback with all result rows afterwards."
    // no need to make sql command into variable so we just run it so
    db.all('SELECT * FROM worddb ORDER BY id ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Send the rows as a JSON response
    });
};

const addNewwordpair = (req, res) => {
    // "The destructuring assignment syntax unpack object properties into variables"
    // here we get wordpairs out of req.body with this
    const { finnish_word, english_word } = req.body;

    //make sql commands into variable
    const query = 'INSERT INTO worddb (finnish_word, english_word ) VALUES (?, ?)';


    db.run(query, [finnish_word, english_word], function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Failed to insert data into the database.',
                suggestion: 'Ensure finnish_word and english_word are valid strings.',
            });
        }

        // `this.lastID` gives the ID of the inserted row
        res.status(201).json({ id: this.lastID, finnish_word, english_word });
    });
};

const deleteWordpair = (req, res) => {
    //get wordpairs id from req
    const wordpair_id = parseInt(req.params.myId);

    //make sql commands into variable
    const query = 'DELETE FROM worddb WHERE id = ?';

    //"Runs the SQL query with the specified parameters and calls the callback afterwards. "
    // "It does not retrieve any result data."
    // here we run the sql command with the id we got to find what to delete from db
    db.run(query, [wordpair_id], function (error) {
        if (error) {
            return res.status(500).json({
                error: 'Failed to delete wordpair from the database.',
                suggestion: 'Ensure the ID exists and is valid.',
            });
        }

        res.status(204).send();
    });
};

const updateWordpair = (req, res) => {
    //get wordpairs id from req and get wordpairs out of req.body with destructuring
    const wordpair_id = parseInt(req.params.myId);
    const { finnish_word, english_word } = req.body;

    //check that there are both words as we need wordpairs
    if (!finnish_word || !english_word) {
        return res.status(400).json({
            error: 'Both finnish_word and english_word are required.',
            suggestion: 'Ensure both fields are provided.',
        });
    }

    //make sql commands into variable
    const query = 'UPDATE worddb SET finnish_word = ?, english_word = ? WHERE id = ?';

    // here we run the sql command with the id we got to find what to update from db with the new wordpair
    db.run(query, [finnish_word, english_word, wordpair_id], function (error) {
        if (error) {
            return res.status(500).json({
                error: 'Failed to update wordpair in the database.',
                suggestion: 'Ensure the ID exists and is valid.',
            });
        }

        res.status(200).json({ id: wordpair_id, finnish_word, english_word });
    });
};

module.exports = {
    getAllWords,
    addNewwordpair,
    deleteWordpair,
    updateWordpair
};