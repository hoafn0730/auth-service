const { StatusCodes } = require('http-status-codes');
const { profileService } = require('../services/profileService');

const updateProfile = async (req, res, next) => {
    try {
        const updated = await profileService.update(req.user.id, req.body);

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { updateProfile };
