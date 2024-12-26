const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const JwtProvider = require('../providers/JwtProvider');

// isAuthorized
const authMiddleware = async (req, res, next) => {
    const { accessToken } = req.cookies;
    const tokenFromHeader = JwtProvider.extractToken(req.headers.authorization);

    if (!(accessToken || tokenFromHeader)) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
    }

    try {
        const token = accessToken || tokenFromHeader;
        const decoded = JwtProvider.verifyToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        if (error?.message?.includes('jwt expired')) {
            return next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'));
        }

        next(new ApiError(StatusCodes.UNAUTHORIZED, StatusCodes[StatusCodes.UNAUTHORIZED]));
    }
};

const checkPermission = async (req, res, next) => {
    try {
        //
    } catch (error) {
        next(error);
    }
};

const checkUserLogin = async (req, res, next) => {
    const cookies = req.cookies;
    const tokenFromHeader = JwtProvider.extractToken(req.headers.authorization + '');

    if (cookies?.accessToken || tokenFromHeader) {
        const token = cookies?.accessToken || tokenFromHeader;
        const decoded = JwtProvider.verifyToken(token);
        req.user = decoded;
    }
    next();
};

module.exports = { authMiddleware, checkUserLogin, checkPermission };
