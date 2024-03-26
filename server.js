const express = require("express");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { model1 } = require('./mongo.js');
const { finddata, submitQuote, getdata } = require('./mongo1.js');
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "s#@123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'eid2',
    passwordField: 'pass2'
},
    async (usernameField, passwordField, done) => {
        try {
            const user = await finddata(usernameField, passwordField);
            
            if (user) {
                return done(null, user);
                // /....................
            } else {
                return done(null, false, { message: 'Incorrect username or password' });
            }
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser(model1.serializeUser());
passport.deserializeUser(model1.deserializeUser());
app.get('/', (req, res) => {
    res.render("home");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/quote', (req, res) => {
    res.render("createquote");
});

app.get('/posted_quotes', (req, res) => {
    res.render("quote");
});

app.get('/loginsuccess', (req, res) => {
    res.render("logginsuccess");
});

app.get('/logout', (req, res) => {
    //req.logout();
    res.redirect('/');
});

app.post('/submit1', async (req, res) => {
    const { eid1, pass1 } = req.body;
    const hashedPassword = await bcrypt.hash(pass1, 10);
    try {
        console.log("Received registration request for:", eid1);
        console.log("Hashed Password:", hashedPassword);
        const newUser = new model1({
            eid1: eid1,
            pass1: hashedPassword,
        });
        await newUser.save();
        console.log("User registered successfully:", newUser);
        res.render("logginsuccess");
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send("Registration failed");
    }
});

app.post('/submit2', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect("/loginsuccess");
});

app.post('/submit3', async (req, res) => {
    const { post, color } = req.body;
    try {
        await submitQuote(post, color);
        const quotedata = await getdata(post, color);
        res.render("quote", { quotedata });
    } catch (error) {
        console.error("Quote Submission Error:", error);
        res.status(500).send("Quote submission failed");
    }
});

app.listen(3000, () => {
    console.log("Server Started");
});
