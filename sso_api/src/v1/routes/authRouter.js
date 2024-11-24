const passport = require('passport');
const router = require('express').Router();
const authController = require('../controllers/authController');
const authValidation = require('../validations/authValidation');
const { authMiddleware } = require('../middlewares/authMiddleware');

require('../controllers/passportController/passportLocal');
require('../controllers/passportController/passportGoogle');
require('../controllers/passportController/passportFacebook');
require('../controllers/passportController/passportGithub');

router.post('/login', authValidation.login, authController.login);
router.post('/signup', authValidation.signup, authController.signup);
router.get('/logout', authController.logout);
router.post('/verify', authController.verifyServices);
router.post('/refresh-token', authController.refreshToken);
router.get('/current-user', authMiddleware, authController.getCurrentUser);

// GET /auth/google
router.get('/google', (req, res, next) => {
    const redirectUrl = req.query.serviceURL;
    const isPopup = !!req.query.popup;

    const state = encodeURIComponent(redirectUrl) + ',' + isPopup;
    passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
});

// GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.BACKEND_SSO + '/login' }),
    authController.loginSocial,
);

// GET /auth/facebook
router.get('/facebook', (req, res, next) => {
    const redirectUrl = req.query.serviceURL;
    const isPopup = !!req.query.popup;

    const state = encodeURIComponent(redirectUrl) + ',' + isPopup;
    passport.authenticate('facebook', { scope: ['email', 'public_profile'], state })(req, res, next);
});

// GET /auth/facebook/callback
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: process.env.BACKEND_SSO + '/login' }),
    authController.loginSocial,
);

// GET /auth/github
router.get('/github', (req, res, next) => {
    const redirectUrl = req.query.serviceURL;
    const isPopup = !!req.query.popup;

    const state = encodeURIComponent(redirectUrl) + ',' + isPopup;
    passport.authenticate('github', { scope: ['user:email'], state })(req, res, next);
});

// GET /auth/github/callback
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: process.env.BACKEND_SSO + '/login' }),
    authController.loginSocial,
);

module.exports = router;
