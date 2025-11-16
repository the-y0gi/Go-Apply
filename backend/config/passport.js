const dotenv = require("dotenv");
dotenv.config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "/api/auth/google/callback",
      callbackURL: "https://go-apply.vercel.app/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails[0].value,
            passwordHash: Math.random().toString(36).slice(-8),
            profileCompleted: false,
            registrationStep: 0,
          });
        }

        const token = generateToken(user._id);
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      // callbackURL: "/api/auth/facebook/callback",
      callbackURL: "https://go-apply.vercel.app/api/auth/facebook/callback",

      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name?.familyName,
            email,
            passwordHash: Math.random().toString(36).slice(-8),
            profileCompleted: false,
            registrationStep: 0,
          });
        }

        const token = generateToken(user._id);
        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);
