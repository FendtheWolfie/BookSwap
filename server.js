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
setupRoute(app, '/kontakt','kontakt.ejs')
setupRoute(app, '/testdb','testdb.ejs')



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





//connect to db
const db = new sqlite3.Database("./userinformation.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})

//kreiren von einem table
var sql = `CREATE TABLE users(id INTEGER PRMARY KEY,first_name,last_name, username,password,email,)`;
db.run(sql)

//drop table
db.run("DROP TABLE users");

//insert data into table


sql = `INSERT INTO users(first_name,last_name,username,password,email) Values(?,?,?,?,?)`;
db.run(sql,[], (err) => {
    if (err) return console.error(err.message)
})


//direkter link zur seite mit integriertem port - wenn dieser wechselt wird der link immernoch funktionnieren
app.listen(port, () => {
    console.log(`localhost:${port}`)
})
