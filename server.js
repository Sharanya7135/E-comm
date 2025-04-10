// ✅ 1. REQUIREMENTS
const express = require('express');
const path = require('path');
const session = require('express-session'); // Moved up here
const fs = require('fs');
const app = express();
const PORT = 3000;

// ✅ 2. MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Static files (CSS, JS, HTML)

app.use(session({
    secret: 'mySecretKey123',     // use env variable in real projects
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }     // Set to true if using HTTPS
}));

// ✅ 3. AUTH MIDDLEWARE (👇 Add this here)
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next(); // User is logged in
    } else {
        res.redirect('/login.html'); // Not logged in
    }
}

// ✅ 4. ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// ✅ 5. LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Replace this with Firebase check later
    if (username === 'user' && password === 'pass') {
        req.session.user = {
            username: username
        };
        res.redirect('/profile');
    } else {
        res.send('Login failed. <a href="/login.html">Try again</a>');
    }
});

// ✅ 6. LOGOUT ROUTE
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

// ✅ 7. PROTECTED ROUTES (👇 use middleware here)
app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/cart', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// ✅ 8. PRODUCT API
app.get('/api/products', (req, res) => {
    fs.readFile('maut.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load products' });
        }
        res.json(JSON.parse(data));
    });
});

// ✅ 9. START SERVER
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
