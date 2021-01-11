const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const api = require('./routes/api');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// USES PROVIDED PORT FROM PRODUCTION, OTHERWISE
// USES PORT 5000
const port = process.env.PORT || 5000;

// CORS usage
const allowList = ['https://thecurtainco.netlify.app/', 'http://localhost:3000'];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Check each url in allowList and see if it includes the origin (instead of matching exact string)
    const allowListIndex = allowList.findIndex((url) => url.includes(origin));
    console.log("found allowListIndex", allowListIndex);
    callback(null, allowListIndex > -1);
  }
};
app.use(cors(corsOptions));

// SERVER PORT LISTENING TO
const server = app.listen(port, () => {
  console.log('listening on port:' + port);
});

// MONGODB
const isTesting = (process.env.NODE_ENV === 'test');
// TODO - set dev db
const dbConnection = isTesting ? "mongodb+srv://phil_antiporda:philAntiporda21@thecurtainco.gh7pp.mongodb.net/curtainCoTest?retryWrites=true&w=majority" : process.env.MONGODB_URI || 'mongodb://localhost/curtainCo';
// Set three properties to avoid deprecation warnings:
mongoose.connect(dbConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (err) => {
  if (err)
    console.log('Error connecting to database', err);
  else
    console.log('Connected to database!');
});

// ALLOWING PARAMS TO COME AS REQ.BODY
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// PASSPORT COMPONENTS USING MONGOSTORE
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const initPassport = require("./config/passport");
const MongoStore = require("connect-mongo")(session);

initPassport(passport);
const sessionConfig = {
  secret: process.env.SECRET_SESSION, // .env
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  cookie: {
    httpOnly: false,
    expires: 3_600_000
  },
};

if (process.env.NODE_ENV === 'production') {
  sessionConfig.cookie.sameSite = 'none'; // allow cross-site usage of cookies
  sessionConfig.cookie.secure = true; // secures cookies
}
app.enable('trust proxy');
app.use(
  session(sessionConfig)
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// ALL OTHER ROUTES
app.use('/api', api);

module.exports = { app, server };