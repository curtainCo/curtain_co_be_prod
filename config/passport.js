const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/user');


function initialize(passport) {
  function authenticateUser(email, password, done) {

    User.findOne({ email }, async (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Invalid Email" });
      }
      try {
        const isValid = await user.verifyPassword(password);
        if (isValid) {
          return done(null, user, { message: "Logged in successfully" });
        }
        else {
          return done(null, false, { message: "Invalid Password" });
        }
      } catch (error) {
        return done(error);
      }
    });
  }

  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = initialize;