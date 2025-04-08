const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const connection = require('./v1/config/connection');
const errorHandlingMiddleware = require('./v1/middlewares/errorHandlingMiddleware');
const { corsOptions } = require('./v1/config/cors');
const { sequelize } = require('./v1/models');

const app = express();
const myStore = new SequelizeStore({
    db: sequelize,
});

connection();

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(
    session({
        secret: 'keyboard cat',
        store: myStore,
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            httpOnly: true,
            // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
            domain: process.env.COOKIE_DOMAIN,
            // recommended you use this setting in production if your site is published using HTTPS
            secure: true, // Chỉ bật secure khi ở production
            sameSite: 'none',
        },
    }),
);

myStore.sync();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(errorHandlingMiddleware);
app.use('/api/v1', require('./v1/routes'));
app.use((req, res, next) => {
    const user = req.session?.passport?.user;
    console.log('req.user: ', req.user);
    console.log(user);

    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    next();
});

module.exports = app;
