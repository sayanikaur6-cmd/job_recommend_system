const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const getNextSequence = require("../utils/getNextSequence"); // 👈 add this
const { sendEmail } = require("../utils/emailService");
const downloadFile = require("../utils/downloadFile");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          const user_id = await getNextSequence("user_id");
          let profilePic = "";

          // 🔥 Google image download
          if (profile.photos?.[0]?.value) {
            profilePic = await downloadFile(
              profile.photos[0].value,
              "profile"
            );
            console.log("Profile picture downloaded:", profilePic);
          }
          // 📧 Send Email (non-blocking safe way)
          
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            photo: profile.photos[0].value,
            user_id: user_id,
            profilePic: profilePic,
          });
          sendEmail({
            to: email,
            subject: "Welcome 🎉",
            html: `
                  <div style="font-family: Arial, sans-serif; background-color: #f4f7f9; padding: 20px;">
                    
                    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                      
                      <!-- Header -->
                      <div style="background: #4CAF50; padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0;">Welcome 🎉</h1>
                      </div>

                      <!-- Body -->
                      <div style="padding: 30px; text-align: center;">
                        <h2 style="color: #333;">Hello ${profile.displayName},</h2>
                        <p style="color: #555; font-size: 16px;">
                          Your account has been created successfully.
                        </p>

                        <p style="color: #777; font-size: 14px;">
                          We're excited to have you onboard 🚀
                        </p>

                        <!-- Button -->
                        <a href="http://localhost:5173"
                          style="display: inline-block; margin-top: 20px; padding: 12px 25px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                          Go to Dashboard
                        </a>
                      </div>

                      <!-- Footer -->
                      <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                        <p style="margin: 0;">© 2026 Your App. All rights reserved.</p>
                      </div>

                    </div>
                  </div>
                  `
          });
          console.log("New user created");
        } else {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          console.log("User logged in");
        }

        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
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

module.exports = passport;