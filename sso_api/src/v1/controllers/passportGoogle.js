const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_APP_CLIENT_ID,
            clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN,
            passReqToCallback: true,
        },
        async function (req, accessToken, refreshToken, profile, cb) {
            const rawData = {
                username: profile?.emails.length > 0 ? profile.emails[0].value : profile.id,
                email: profile?.emails.length > 0 ? profile.emails[0].value : profile.id,
                fullName: profile?.displayName,
                avatar: profile?.photos.length > 0 && profile?.photos[0].value,
                role: 'user',
                type: 'GOOGLE',
            };

            const [user] = await db.User.findOrCreate({
                where: { email: rawData.email, type: 'GOOGLE' },
                defaults: rawData,
                raw: true,
                attributes: { exclude: ['password', 'role', 'code'] },
            });

            return cb(null, user);
        },
    ),
);
