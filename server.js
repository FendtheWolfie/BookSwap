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
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const multer = require('multer');

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
setupRoute(app, '/kaufen','kaufen.ejs')


app.get('/api/data', (req, res) => {
    res.json({message: 'this is my data',
            text: 'hbhhjbhhj'
    })
})

/*
app.get('/api/image', (req, res) => {
    const imagePath = path.join(__dirname, 'public', 'images', 'fox.png');
    const imageBase64 = fs.readFileSync(imagePath, 'base64');
    res.json({
        message: 'this is my data',
        text: 'hbhhjbhhj',
        image: imageBase64
    });
})
*/

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
            webauthentication TEXT DEFAULT (hex(randomblob(4))),
            auth_token TEXT,
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

            const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

            const insertUserSql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
            db.run(insertUserSql, [username, hashedPassword, email], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Username already in use' });
                }

                res.status(200).json({
                    message: 'User registered successfully',
                    success: true
                });

            });
        });
    });
});

// User login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) {
            return res.status(500).send("Error logging in");
        }
        if (!user) {
            return res.status(401).send("Invalid credentials");
        }
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        if (hashedPassword !== user.password) {
            return res.status(401).send("Invalid credentials");
        }
        const authToken = generateAuthToken(); // Generate an auth token
        res.cookie('auth_token', authToken, { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true  
        }); // Save auth token as a cookie

        // Save auth token in the database
        const updateAuthTokenSql = `UPDATE users SET auth_token = ? WHERE id = ?`;
        db.run(updateAuthTokenSql, [authToken, user.id], (err) => {
            if (err) {
                return res.status(500).send("Error saving auth token");
            }
            res.status(200).json({
                success: true
            });
        });
    });
});

// Middleware to check auth token
function authMiddleware(req, res, next) {
    const authToken = req.cookies.auth_token;
    if (!authToken) {
        return res.status(401).send("You need to log in");
    }
    // Verify the auth token
    const checkAuthTokenSql = `SELECT * FROM users WHERE auth_token = ?`;
    db.get(checkAuthTokenSql, [authToken], (err, user) => {
        if (err) {
            return res.status(500).send("Error verifying auth token");
        }
        if (!user) {
            return res.status(401).send("Invalid auth token");
        }
        req.user = user; // Attach user to request object
        next();
    });
}

function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex');
}

/*
// Protect specific subsite
app.get('/login', authMiddleware, (req, res) => {
    res.render('login.ejs');
});
*/
// Configure multer for file uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', authMiddleware, upload.array('bookImages', 5), (req, res) => {
    const { bookTitle, publicationYear, schoolSubject, bookCondition, educationLevel, price, bookDescription } = req.body;
    const authToken = req.cookies.auth_token; // Get the auth token from the cookies
    const imagePath = req.file ? req.file.path : null; // Get the uploaded image path

    let filelocation = "";
    for (let i = 0; i < req.files.length; i++) {
        filelocation += req.files[i].path + ";";
    }


    const createTableSql = `
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            webauthentication TEXT,
            username TEXT,
            Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            filelocation TEXT,
            bookTitle TEXT,
            publicationYear INTEGER,
            schoolSubject TEXT,
            bookCondition TEXT,
            educationLevel TEXT,
            price INTEGER,
            bookDescription TEXT
        )
    `;
    db.run(createTableSql, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating table' });
        }

        const getUserSql = `SELECT webauthentication, username FROM users WHERE auth_token = ?`;
        db.get(getUserSql, [authToken], (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching user' });
            }
            if (!user) {
                return res.status(401).json({ message: 'Invalid auth token' });
            }
            
            "webauthentication, username, filelocation, publicationYear, schoolSubject, bookCondition, educationLevel, price, bookDescription"

            const insertBookSql = `INSERT INTO books (webauthentication, username, filelocation, bookTitle, publicationYear, schoolSubject, bookCondition, educationLevel, price, bookDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.run(insertBookSql, [user.webauthentication, user.username, filelocation, bookTitle, publicationYear, schoolSubject, bookCondition, educationLevel, price, bookDescription], (err) => {
                if (err) {
                    console.log(err.name);
                    console.log(err.message);
                    console.log(err.stack);
                    return res.status(500).json({ message: 'Error inserting book' });
                }

                res.status(200).json({
                    message: 'Book inserted successfully',
                    success: true
                });
            });
        });
    });
});

app.get('/api/check-login', (req, res) => {
    const authToken = req.cookies.auth_token;
    if (!authToken) {
        return res.status(401).json({ loggedIn: false, message: 'Not logged in' });
    }

    const checkAuthTokenSql = `SELECT * FROM users WHERE auth_token = ?`;
    db.get(checkAuthTokenSql, [authToken], (err, user) => {
        if (err) {
            return res.status(500).json({ loggedIn: false, message: 'Error verifying auth token' });
        }
        if (!user) {
            return res.status(401).json({ loggedIn: false, message: 'Invalid auth token' });
        }
        res.status(200).json({ loggedIn: true, message: 'User is logged in' });
    });
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`HTTPS Server running at https://localhost:${port}/`);
})