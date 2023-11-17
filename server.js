//preliminaries to create code
const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid')
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Path to the db.json file
const database = path.join(__dirname, 'db.json');

// HTML route for the main page
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// HTML route for the notes page
app.get('/notes', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Get route
app.get('/api/notes', (req, res) => {
  // Reads the data/notes from the database/db.json file
  fs.readFile(database, 'utf8', (err, data) => {
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

//post route for new notes
app.post('/api/notes', (req, res) => {
  // Reads the data/notes from the database/db.json file
  fs.readFile(database, 'utf8', (err, data) => {

    const notes = JSON.parse(data);
    const newNote = req.body;
    //gives each note a uniqeid, hopefully
    newNote.id = uniqid()
    notes.push(newNote);
  
    // Writes notes/data input into db.json/database
    fs.writeFile(database, JSON.stringify(notes), 'utf8', (err) => {
      res.json(newNote);
    });
  });
});

// Starts server | localhost:3000
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
