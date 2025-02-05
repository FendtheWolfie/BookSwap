const express = require('express')
const app = express();
const cors = require('cors')
const port = 4000

app.use(express.json());

app.use(express.static('public'))



const path = require('path');
const { clear } = require('console');
const fs = require('fs');
const https = require('https');

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');


// SSL Certificates
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };


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
setupRoute(app, '/kategorie','kategorie.ejs')
setupRoute(app, '/inseraterstellen','inseraterstellen.ejs')
setupRoute(app, '/angebotsansicht','angebotsansicht.ejs')


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
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

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
                return res.status(400).json({ message: 'Email bereits vergeben' });
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

// Serve the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// User login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) {
            return res.status(500).send("Error logging in");
        }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid credentials");
        }
        const authToken = generateAuthToken(); // Generate an auth token
        res.cookie('auth_token', authToken, { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true // Set to true if using HTTPS
        }); // Save auth token as a cookie
        req.session.userId = user.id;
        res.status(200).send("Logged in successfully");
    });
});

// Function to generate an auth token (you can customize this)
function generateAuthToken() {
    return Math.random().toString(36).substring(2); // Simple token generation for example purposes
}

// Middleware to check auth token
function authMiddleware(req, res, next) {
    const authToken = req.cookies.auth_token;
    if (!authToken) {
        return res.status(401).send("You need to log in");
    }
    // Here you would typically verify the auth token
    next();
}

// Protected route example
app.get('/dashboard', authMiddleware, (req, res) => {
    res.send("Welcome to your dashboard");
});
/*
//direkter link zur seite mit integriertem port - wenn dieser wechselt wird der link immernoch funktionnieren
app.listen(port, '0.0.0.0', () => {
 console.log(`Server running at http://192.168.156.254:${port}/`);
})
*/

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`HTTPS Server running at https://localhost:${port}/`);
});