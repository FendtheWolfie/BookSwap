const express = require('express')
const app = express();
const cors = require('cors')
const port = 4000

app.use(express.json());

app.use(express.static('public'))

const path = require('path');
const { clear } = require('console');
const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');


//diese folgenden 2 commands konfigurieren express die ejs templates zu verwenden
//es wird auch deklariert, wo sich die templates befinden, hier z.B. im views folder

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

//test

//alte funktion:app.get('/impressum', (req, res) => {
//    res.render('impressum.ejs')})
//const (ein value der sich nie verändert) hier, setupRoute und es wird der inhalt definiert; routePath wird der path assigned
//jedoch um spaghetti code zu umgehen, verweneden wir diese funktion:


const setupRoute = (app, routePath, viewName) => {
    app.get(routePath, (req, res) => {
        res.render(viewName);
    });
};

//nach der funktion können wir flexibel einzelne zeilen hinzufügen um weitere subpages zu ermögliche
//setupRoute
setupRoute(app, '/', 'index.ejs')
setupRoute(app, '/impressum','impressum.ejs')
setupRoute(app, '/geschichte','geschichte.ejs')
setupRoute(app, '/login','login.ejs')
setupRoute(app, '/testdb','testdb.ejs')
setupRoute(app, '/registrierung','registrierung.ejs')


app.get('/api/data', (req, res) => {
    res.json({message: 'this is my data',
            text: 'hbhhjbhhj'
    })
})


app.get('/api/image', (req, res) => {
    const imagePath = path.join(__dirname, 'public', 'images', 'fox.png');
    const imageBase64 = fs.readFileSync(imagePath, 'base64');
    res.json({
        message: 'this is my data',
        text: 'hbhhjbhhj',
        image: imageBase64
    });
})


const db = new sqlite3.Database(path.join(__dirname, 'userinformation.db'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the userinformation.db database.');
    }
});

app.post('/api/registration', (req, res) => {
    const { username, password, email } = req.body;

    const createTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            auth_token TEXT DEFAULT (hex(randomblob(4))),
            username TEXT UNIQUE,
            password TEXT,
            email TEXT UNIQUE,
            Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createTableSql, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating table' });
        }

        const checkEmailSql = `SELECT * FROM users WHERE email = ?`;
        db.get(checkEmailSql, [email], (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking email' });
            }

            if (row) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                const insertUserSql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
                db.run(insertUserSql, [username, hashedPassword, email], (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Benutzername bereits vergeben' });
                    }

                    res.status(200).json({ message: 'User registered successfully' });
                });
            });
        });
    });
});





//connect to db
//const db = new sqlite3.Database("./userinformation.db", sqlite3.OPEN_READWRITE, (err) => {
//    if (err) return console.error(err.message);
//})

//kreiren von einem tablevar sql = `CREATE TABLE users(id INTEGER PRMARY KEY,first_name,last_name, username,password,email,)`;
//db.run(sql)

//drop table
//db.run("DROP TABLE users");

//insert data into table


//sql = `INSERT INTO users(first_name,last_name,username,password,email) Values(?,?,?,?,?)`;
//db.run(sql,[], (err) => {
//    if (err) return console.error(err.message)
//})


//direkter link zur seite mit integriertem port - wenn dieser wechselt wird der link immernoch funktionnieren
app.listen(port, () => {
    console.log(`localhost:${port}`)
})
