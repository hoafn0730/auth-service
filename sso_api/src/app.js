const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const connection = require('./v1/config/connection');
const { sequelize } = require('./v1/models');
const errorHandlingMiddleware = require('./v1/middlewares/errorHandlingMiddleware');
const { corsOptions } = require('./v1/config/cors');

const app = express();
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const myStore = new SequelizeStore({
    db: sequelize,
});

connection();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: 'keyboard cat',
        store: myStore,
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: true, // if you do SSL outside of node.
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            // the duration in milliseconds that the cookie is valid
            maxAge: 20 * 60 * 1000, // 20 minutes
            // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
            domain: process.env.COOKIE_DOMAIN,
            // recommended you use this setting in production if your site is published using HTTPS
            secure: true,
        },
    }),
);
myStore.sync();
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(errorHandlingMiddleware);
app.use('/api/v1', require('./v1/routes'));

app.get('/', (req, res) => {
    res.send(
        '<h1>Hello World!</h1>',
        // `<div><h1>Hello world!</h1><a href="http://localhost:3000/login?serviceURL=${encodeURIComponent(
        //     'http://localhost:8080',
        // )}">LOGIN</a><br/><a href="http://localhost:8080/api/v1/auth/logout?serviceURL=${encodeURIComponent(
        //     'http://localhost:8080',
        // )}">LOGOUT</a></div>`,
    );
});

module.exports = app;
