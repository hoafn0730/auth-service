const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { authService } = require('~/v1/services/authService');

passport.serializeUser(function (user, cb) {
    console.log('🚀 ~ serializeUser:', user);
    process.nextTick(function () {
        cb(null, {
            id: user.id,
            username: user.username,
            email: user.email,
            deviceId: user.deviceId,
            lastLogin: new Date().valueOf(),
            is2FAVerified: false,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    console.log('🚀 ~ deserializeUser:', user);
    process.nextTick(function () {
        return cb(null, user);
    });
});

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
