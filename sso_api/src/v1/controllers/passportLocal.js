const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authService = require('../services/authService');

passport.use(
    new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        const res = await authService.login({ email: email, password: password });
        await authService.updateUserCode('LOCAL', email, res.code);

        if (res && res.statusCode === 1) {
            return done(null, false, res);
        }

        return done(null, res);
    }),
);

passport.serializeUser(function (user, cb) {
    console.log('🚀 ~ serializeUser:', user);
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, email: user.email });
    });
});

passport.deserializeUser(function (user, cb) {
    console.log('🚀 ~ deserializeUser:', user);
    process.nextTick(function () {
        return cb(null, user);
    });
});
