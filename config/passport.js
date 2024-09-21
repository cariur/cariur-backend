const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");

// Function to generate a unique username
function generateUsername(firstName, lastName) {
  // Default to an empty string if names are not provided
  const cleanFirstName = firstName
    ? firstName.toLowerCase().replace(/\s+/g, "")
    : "";
  const cleanLastName = lastName
    ? lastName.toLowerCase().replace(/\s+/g, "")
    : "";

  // Generate a random number and convert it to a string
  const randomNumber = crypto.randomInt(1000, 9999).toString();

  // Combine names with the random number to create a unique username
  const username = `${cleanFirstName}${cleanLastName}${randomNumber}`.trim();

  // Ensure the username is not empty
  return username || `user${randomNumber}`;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.REDIRECT_URI}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          // Extract user information from the profile
          const firstName = profile.name.givenName || "";
          const lastName = profile.name.familyName || "";

          // Generate a unique username
          const username = generateUsername(firstName, lastName);

          // Create a new user with Google profile information
          user = new User({
            googleId: profile.id, // Google ID
            email: profile.emails[0].value, // Google email
            firstName: firstName, // First name
            lastName: lastName, // Last name
            username: username, // Unique username
            profilePicture: profile._json.picture, // Google profile picture URL
            isVerified: profile._json.email_verified, // Email verification status
          });

          // Save the new user to the database
          await user.save();
        }

        // Proceed with the login
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "User not found" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
