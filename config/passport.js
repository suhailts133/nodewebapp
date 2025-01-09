const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userSchema.js");
const env = require("dotenv").config();

// Passport Google OAuth Strategy
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists using the email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If the user exists and googleId is not set, update the googleId
          if (!user.googleId) {
            user.googleId = profile.id; // Set googleId for the existing user
            user.name = profile.displayName; // Optionally update name
            await user.save(); // Save the updated user information
          }
          return done(null, user); // Return the existing or updated user
        } else {
          // If the user doesn't exist, create a new one
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id, // Set the googleId when creating a new user
          });
          await user.save(); // Save the new user in the database
          return done(null, user); // Return the newly created user
        }
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error, null); // Pass the caught error to done
      }
    }
  )
);

// Serialize user into session (store user._id)
passport.serializeUser((user, done) => {
  done(null, user._id); // Store only the user _id in the session
});

// Deserialize user from session (retrieve user from database using _id)
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user); // Attach the user object to the session
  } catch (error) {
    done(error, null); // Handle any errors during deserialization
  }
});

module.exports = passport;
