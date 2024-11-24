const { StatusCodes } = require('http-status-codes');
const jwtService = require('../services/jwtService');
const ApiError = require('../utils/ApiError');

const nonSecurePaths = ['/logout', '/login', '/register', '/verify-services'];

const authMiddleware = async (req, res, next) => {
    try {
        if (nonSecurePaths.includes(req.path)) return next();

        const cookies = req.cookies;
        const tokenFromHeader = jwtService.extractToken(req.headers.authorization);

        if (cookies?.accessToken || tokenFromHeader) {
            const token = cookies?.accessToken || tokenFromHeader;
            const decoded = jwtService.verifyToken(token);

            if (decoded && decoded !== 'TokenExpiredError') {
                req.user = decoded;
                next();
            } else if (decoded && decoded === 'TokenExpiredError' && cookies?.refreshToken) {
                return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                    statusCode: StatusCodes.METHOD_NOT_ALLOWED,
                    message: 'TokenExpiredError & Need to retry new token',
                    data: '',
                });
            } else {
                next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
            }
        } else if (!cookies?.accessToken && cookies?.refreshToken) {
            return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                statusCode: StatusCodes.METHOD_NOT_ALLOWED,
                message: 'TokenExpiredError & Need to retry new token',
                data: '',
            });
        } else {
            next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
        }
    } catch (error) {
        next(error);
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
    const tokenFromHeader = jwtService.extractToken(req.headers.authorization + '');

    if (cookies?.accessToken || tokenFromHeader) {
        const token = cookies?.accessToken || tokenFromHeader;
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        next();
    } else {
        next();
    }
};

module.exports = { authMiddleware, checkUserLogin, checkPermission };
