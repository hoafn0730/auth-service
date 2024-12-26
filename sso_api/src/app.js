const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { StatusCodes } = require('http-status-codes');

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
            secure: process.env.NODE_ENV === 'production', // Chỉ bật secure khi ở production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
/// *
app.response.sendResponse = function (statusCode, message, data) {
    if (typeof message === 'object') {
        // Nếu chỉ có 2 tham số, và `message` là `data`, gán giá trị mặc định cho `message`
        data = message;
        message = StatusCodes[statusCode];
    }
    // code is intentionally kept simple for demonstration purpose
    return this.status(statusCode).json({ statusCode, message, data });
};

app.get('/', (req, res) => {
    console.log(req.headers['user-agent']);

    res.sendResponse(200, 'Hello World!');
    // res.send('<h1>Hello World!</h1>\n<a href="' + process.env.BACKEND_SSO + '">Back to login</a>');
});

module.exports = app;
