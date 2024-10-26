// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 5000;

app
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true ,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,  // MongoDB connection URI
      dbName: process.env.DB_NAME    // Database name
    }),
  }))
  // This is the basic express session ({...}) initialization
  .use(passport.initialize())
  // init passport on every route call
  .use(passport.session())
  // allow passport to use "express-session"
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', "PATCH"]}))
  .use(cors({ origin: '*'}))
  .use('/', require('./routes'));

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ githubId: profileId }, function (err, user) {
    return done(null, profile);
    //});
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

app.get('/github/callback', passport.authenticate('github', {
    failuretodirect: 'api-docs', session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node running on port ${port}`)});
    }
});