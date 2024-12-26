const router = require('express').Router();
const profileRouter = require('./profileRouter');
const authRouter = require('./authRouter');
const { StatusCodes } = require('http-status-codes');

router.use('/profile', profileRouter);
router.use('/auth', authRouter);

router.use('/test', (req, res) => {
    res.json({ statusCode: StatusCodes.ok, message: 'ok' });
});

module.exports = router;
