const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./snake_game.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the snake game database.');
});

db.run('CREATE TABLE IF NOT EXISTS highscore(score INTEGER)');

module.exports = db;
