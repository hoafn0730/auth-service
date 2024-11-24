const passport = require('passport');
const db = require('~/v1/models');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_APP_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
            passReqToCallback: true,
        },
        async function (req, accessToken, refreshToken, profile, cb) {
            const rawData = {
                username: profile?.username ? profile?.username : profile.id,
                email: profile?.emails?.length > 0 ? profile.emails[0].value : profile.id,
                fullName: profile?.displayName,
                avatar: profile?.photos?.length > 0 ? profile?.photos[0].value : '',
                role: 'user',
                type: 'FACEBOOK',
            };

            const [user] = await db.User.findOrCreate({
                where: { email: rawData.email, type: 'FACEBOOK' },
                defaults: rawData,
                raw: true,
                attributes: { exclude: ['password', 'role', 'code'] },
            });

            return cb(null, user);
        },
    ),
);
