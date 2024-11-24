const { StatusCodes } = require('http-status-codes');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/authService');
const jwtService = require('../services/jwtService');
const db = require('../models');
const ApiError = require('../utils/ApiError');

const login = (req, res, next) => {
    const serviceURL = req.query.serviceURL;
    const isPopup = req.query.popup === 'true' && true;

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(StatusCodes.OK).json({ message: info.message });
        }

        req.login(user, async (err) => {
            if (err) {
                return next(err);
            }

            const payload = {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username,
            };

            const accessToken = jwtService.createToken(payload);
            const refreshToken = uuidv4();

            await authService.updateUserCode(req.user.type, req.user.email, refreshToken);

            // Đặt Access Token vào cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                domain: process.env.COOKIE_DOMAIN,
                maxAge: 15 * 60 * 1000,
            });

            // Đặt Refresh Token vào cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                domain: process.env.COOKIE_DOMAIN,
            });

            if (isPopup) {
                return res.redirect(process.env.BACKEND_SSO + '/reload');
            } else if (serviceURL && serviceURL !== 'null') {
                return res.redirect(serviceURL);
            } else {
                return res.redirect(process.env.BACKEND_SSO);
            }
        });
    })(req, res, next);
};

const signup = async (req, res, next) => {
    try {
        const serviceURL = req.query.serviceURL;
        const data = await authService.signup(req.body);

        if (data.statusCode !== 0) {
            next(data);
        }

        return res.redirect(process.env.BACKEND_SSO_LOGIN + '?serviceURL=' + serviceURL);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN });
        res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN });
        res.clearCookie('connect.sid', { domain: process.env.COOKIE_DOMAIN });
        req.session.destroy();

        res.json({ statusCode: StatusCodes.OK, message: StatusCodes[StatusCodes.OK] });
    });
};

const verifyServices = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const tokenFromHeader = jwtService.extractToken(req.headers?.authorization);

        if (tokenFromHeader) {
            const token = cookies?.accessToken || tokenFromHeader;
            const decoded = jwtService.verifyToken(token);

            if (decoded && decoded !== 'TokenExpiredError') {
                const user = await db.User.findOne({
                    where: {
                        id: decoded.id,
                    },
                    raw: true,
                    attributes: { exclude: ['password', 'role', 'type', 'code'] },
                });

                return res.status(StatusCodes.OK).json({
                    statusCode: StatusCodes.OK,
                    message: 'Verify the user',
                    data: user,
                });
            } else if (decoded && decoded === 'TokenExpiredError') {
                return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                    statusCode: StatusCodes.METHOD_NOT_ALLOWED,
                    message: 'TokenExpiredError & Need to retry new token',
                    data: '',
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    statusCode: StatusCodes.UNAUTHORIZED,
                    message: StatusCodes[StatusCodes.UNAUTHORIZED],
                    data: '',
                });
            }
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            statusCode: StatusCodes.UNAUTHORIZED,
            message: StatusCodes[StatusCodes.UNAUTHORIZED],
            data: '',
        });
    } catch (error) {
        next(error);
    }
};

const loginSocial = async (req, res, next) => {
    try {
        const serviceURL = decodeURIComponent(req.query.state.split(',')[0]);
        const isPopup = req.query.state.split(',')[1] === 'true' && true;

        const payload = {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
        };

        // Tạo Access Token và Refresh Token
        const accessToken = jwtService.createToken(payload);
        const refreshToken = uuidv4();

        await authService.updateUserCode(req.user.type, req.user.email, refreshToken);

        // Đặt Access Token vào cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true, // Không cho phép truy cập cookie từ JavaScript
            secure: true, // Chỉ gửi cookie qua HTTPS
            sameSite: 'Strict', // Ngăn chặn tấn công CSRF
            domain: process.env.COOKIE_DOMAIN,
            // maxAge: 24 * 60 * 60 * 1000, // (24h)
            maxAge: 15 * 60 * 1000, // (15 phút)
        });

        // Đặt Refresh Token vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 7 * 24 * 60 * 60 * 1000, // (1 tuần)
        });

        if (isPopup) {
            return res.redirect(process.env.BACKEND_SSO + '/reload');
        } else if (serviceURL && serviceURL !== 'null') {
            return res.redirect(serviceURL);
        } else {
            return res.redirect(process.env.BACKEND_SSO);
        }
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken; // Lấy Refresh Token từ cookie
        if (!refreshToken) next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);

        const user = await db.User.findOne({ where: { code: refreshToken }, raw: true });

        if (user) {
            const payload = {
                id: user.id,
                email: user.email,
                username: user.username,
            };

            // Tạo Access Token và Refresh Token
            const newAccessToken = jwtService.createToken(payload);
            const newRefreshToken = uuidv4();

            await authService.updateUserCode(user.type, user.email, newRefreshToken);

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 15 * 60 * 1000,
                domain: process.env.COOKIE_DOMAIN,
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 15 * 60 * 1000,
                domain: process.env.COOKIE_DOMAIN,
            });
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                message: StatusCodes[StatusCodes.OK],
                data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
            });
        } else {
            next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
        }
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
            },
            attributes: { exclude: ['password', 'role', 'type', 'code'] },
        });
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, signup, logout, verifyServices, loginSocial, refreshToken, getCurrentUser };
