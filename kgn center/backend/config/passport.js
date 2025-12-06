const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          // 👉 New User
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: email,
            avatar: profile.photos?.[0]?.value || null,
            isVerified: true,
            hasPassword: false,
            phone: null,
            role: "student",
          });
        } else {
          // 👉 Existing User → Update avatar if missing
          if (!user.avatar && profile.photos?.[0]?.value) {
            user.avatar = profile.photos[0].value;
            await user.save();
          }
        }

        // ✅ JWT with name + picture
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
            name: user.username,
            picture: user.avatar,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser((data, done) => {
  done(null, data);
});
