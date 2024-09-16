// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateFromEmail } = require("unique-username-generator");
const express = require("express");
const app = express();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            googleId: profile.id,
            username: generateFromEmail(profile.emails[0].value, 5),
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            isVerified: true,
          });
          await user.save();
        }

        // Generate the JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // Redirect to frontend with the token as a query parameter
        return done(null, { user, token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Handle Google callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // If authentication is successful, this will execute.
    // Extract the token from req.user
    const token = req.user.token;

    // Redirect to the frontend with the token in the query string
    const redirectUrl = `${process.env.FRONTEND_URL}/login/success?token=${token}`;

    // Send the user back to the frontend with the token
    return res.redirect(redirectUrl);
  }
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
