const router = require('express').Router();

const { User } = require('../models');
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    const users = await User.findAll();

    return res.json({
        data: users,
    });
});

router.patch('/', authMiddleware, profileController.updateProfile);

module.exports = router;
