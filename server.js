const express = require('express');
const app = express();
const path = require('path');
const db = require('./database.js');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/highscore', (req, res) => {
    db.get('SELECT score FROM highscore ORDER BY score DESC LIMIT 1', [], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.json({ highscore: row ? row.score : 0 });
    });
});

app.post('/highscore', (req, res) => {
    const score = req.body.score;
    db.run('INSERT INTO highscore(score) VALUES(?)', [score], (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.status(201).end();
    });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
