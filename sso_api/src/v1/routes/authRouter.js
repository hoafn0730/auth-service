const passport = require('passport');
const router = require('express').Router();
const authController = require('../controllers/authController');
const authValidation = require('../validations/authValidation');
const { authMiddleware } = require('../middlewares/authMiddleware');

require('../controllers/passportLocal');
require('../controllers/passportGoogle');

router.post('/login', authValidation.login, authController.login);
router.post('/signup', authValidation.signup, authController.signup);
router.get('/logout', authController.logout);
router.post('/verify-services', authController.verifyServices);
router.post('/refresh-token', authController.refreshToken);
router.get('/current-user', authMiddleware, authController.getCurrentUser);

router.get('/google', (req, res, next) => {
    const serviceURL = req.query.serviceURL;
    const isPopup = !!req.query.popup;

    const state = encodeURIComponent(serviceURL) + ',' + isPopup;
    passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
});

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.BACKEND_SSO_LOGIN }),
    authController.loginSocial,
);

module.exports = router;
