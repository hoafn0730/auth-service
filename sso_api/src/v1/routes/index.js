const router = require('express').Router();
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const { StatusCodes } = require('http-status-codes');

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/test', (req, res) => {
    res.json({ statusCode: StatusCodes.ok, message: 'ok' });
});

module.exports = router;
