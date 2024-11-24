const passport = require('passport');
const db = require('~/v1/models');
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_APP_CLIENT_ID,
            clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_APP_REDIRECT_LOGIN,
            passReqToCallback: true,
        },
        async function (req, accessToken, refreshToken, profile, cb) {
            const rawData = {
                username: profile?.username,
                email: profile?.emails?.length > 0 ? profile.emails[0].value : profile.id,
                fullName: profile?.displayName,
                avatar: profile?.photos?.length > 0 && profile?.photos[0].value,
                role: 'user',
                type: 'GITHUB',
            };

            const [user] = await db.User.findOrCreate({
                where: { username: rawData.username, email: rawData.email, type: 'GITHUB' },
                defaults: rawData,
                raw: true,
                attributes: { exclude: ['password', 'role', 'code'] },
            });

            return cb(null, user);
        },
    ),
);
