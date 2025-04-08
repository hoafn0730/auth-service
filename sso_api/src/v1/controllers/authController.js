const ms = require('ms');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

const db = require('../models');
const ApiError = require('../utils/ApiError');
const { authService } = require('../services/authService');
const JwtProvider = require('../providers/JwtProvider');
const BrevoProvider = require('../providers/BrevoProvider');

const login = (req, res, next) => {
    const isPopup = req.query.popup === '1';

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

            const accessToken = JwtProvider.createToken(payload);
            const refreshToken = uuidv4();
            await authService.updateUserCode(req.user.type, req.user.email, refreshToken);

            // Đặt Access Token vào cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                domain: process.env.COOKIE_DOMAIN,
                maxAge: ms('14 days'),
            });

            // Đặt Refresh Token vào cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                domain: process.env.COOKIE_DOMAIN,
                maxAge: ms('14 days'),
            });

            if (isPopup) {
                return res.redirect(process.env.BACKEND_SSO + '/reload');
            } else {
                return res.status(StatusCodes.OK).json({
                    statusCode: StatusCodes.OK,
                    message: 'login success',
                    data: { ...user, accessToken, refreshToken },
                });
            }
        });
    })(req, res, next);
};

const loginSocial = async (req, res, next) => {
    try {
        const state = JSON.parse(req.query.state);
        const redirectUrl = decodeURIComponent(state.continue);
        const isPopup = state.popup;

        const payload = {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
        };

        // Tạo Access Token và Refresh Token
        const accessToken = JwtProvider.createToken(payload);
        const refreshToken = uuidv4();

        await authService.updateUserCode(req.user.type, req.user.email, refreshToken);

        // Đặt Access Token vào cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        // Đặt Refresh Token vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        if (isPopup) {
            return res.redirect(process.env.BACKEND_SSO + '/reload');
        } else if (redirectUrl && redirectUrl !== 'null') {
            return res.redirect(redirectUrl);
        } else {
            return res.redirect(process.env.BACKEND_SSO);
        }
    } catch (error) {
        next(error);
    }
};

const signup = async (req, res, next) => {
    try {
        const data = await authService.signup(req.body);

        // Send email verify
        // const verificationLink = `${process.env.WEBSITE_DOMAIN}/verify-account?email=${data.email}$token=${data.code}`;
        // const customSubject = 'Account Verification - Please Confirm Your Email';
        // const htmlContent = `
        //     <h3>Hello, ${data.email}!</h3>
        //     <p>Thank you for signing up. To complete your account setup, please verify your email address.</p>
        //     <p><a href="${verificationLink}">${verificationLink}</a></p>
        //     <p>Click the link above to verify your account and start using our services.</p>
        //     `;
        // await BrevoProvider.sendEmail(data.email, customSubject, htmlContent);

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        //
        res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN });
        res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN });
        res.clearCookie('connect.sid', { domain: process.env.COOKIE_DOMAIN });
        req.session.destroy();

        res.json({ statusCode: StatusCodes.OK, message: StatusCodes[StatusCodes.OK] });
    });
};

const verifyServices = async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.user.id,
            },
            raw: true,
            attributes: { exclude: ['password', 'type', 'code'] },
        });

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'Verified the service',
            data: user,
        });
    } catch (error) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, StatusCodes[StatusCodes.UNAUTHORIZED]));
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);

        const user = await db.User.findOne({ where: { code: refreshToken }, raw: true });

        if (!user) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
        }

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        // Tạo Access Token và Refresh Token
        const newAccessToken = JwtProvider.createToken(payload);
        const newRefreshToken = uuidv4();
        await authService.updateUserCode(user.type, user.email, newRefreshToken);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        });
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
            attributes: { exclude: ['password', 'type', 'code'] },
            raw: true,
        });

        if (user.require2FA) {
            user.is2FAVerified = req.session.passport.user.is2FAVerified;
            user.lastLogin = req.session.passport.user.lastLogin;
        }

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const verifyAccount = async (req, res, next) => {
    const { email, token } = req.body;

    try {
        const resData = await authService.verifyAccount('LOCAL', email, token);

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: resData.message || StatusCodes[StatusCodes.OK],
            data: resData.data,
        });
    } catch (error) {
        next(error);
    }
};

const generate2FaQrCode = async (req, res, next) => {
    try {
        let twoFactorSecretKey = await db.TwoFASecretKey.findOne({ where: { userId: req.user.id } });
        if (!twoFactorSecretKey) {
            twoFactorSecretKey = await db.TwoFASecretKey.create({
                userId: req.user.id,
                value: authenticator.generateSecret(),
            });
        }

        // tao OPT auth token
        const optAuthToken = authenticator.keyuri(req.user.username, '2fa-hoafn0730', twoFactorSecretKey.value);

        // tao anh qrcode
        const qrCodeImageUrl = await QRCode.toDataURL(optAuthToken);

        res.status(StatusCodes.OK).json({ data: qrCodeImageUrl });
    } catch (error) {
        next(error);
    }
};

const setup2fa = async (req, res, next) => {
    try {
        const twoFactorSecretKey = await db.TwoFASecretKey.findOne({ where: { userId: req.user.id } });
        if (!twoFactorSecretKey) {
            return next(new ApiError(StatusCodes.NOT_FOUND), 'Two Factor Secret Key not found!');
        }

        if (!req.body.otpToken) {
            return next(new ApiError(StatusCodes.NOT_FOUND), 'Otp Token not found!');
        }

        const isValid = authenticator.verify({
            token: req.body.otpToken,
            secret: twoFactorSecretKey.value,
        });

        if (!isValid) {
            return next(new ApiError(StatusCodes.NOT_ACCEPTABLE), 'Invalid opt token!');
        }

        const updatedUser = await db.User.update({ require2FA: true }, { where: { id: req.user.id }, returning: true });
        req.session.passport.user.is2FAVerified = true;

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: {
                ...updatedUser,
                is2FAVerified: req.session.passport.user.is2FAVerified,
                lastLogin: req.session.passport.user.lastLogin,
            },
        });
    } catch (error) {
        next(error);
    }
};

const verify2fa = async (req, res, next) => {
    try {
        const twoFactorSecretKey = await db.TwoFASecretKey.findOne({ where: { userId: req.user.id } });
        if (!twoFactorSecretKey) {
            return next(new ApiError(StatusCodes.NOT_FOUND), 'Two Factor Secret Key not found!');
        }

        if (!req.body.otpToken) {
            return next(new ApiError(StatusCodes.NOT_FOUND), 'Otp Token not found!');
        }

        const isValid = authenticator.verify({
            token: req.body.otpToken,
            secret: twoFactorSecretKey.value,
        });

        if (!isValid) {
            return next(new ApiError(StatusCodes.NOT_ACCEPTABLE), 'Invalid opt token!');
        }

        const user = await db.User.findOne({ where: { id: req.user.id } });
        req.session.passport.user.is2FAVerified = true;

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: {
                ...user,
                is2FAVerified: req.session.passport.user.is2FAVerified,
                lastLogin: req.session.passport.user.lastLogin,
            },
        });
    } catch (error) {
        next(error);
    }
};

const disable2fa = async (req, res, next) => {
    try {
        const twoFactorSecretKey = await db.TwoFASecretKey.findOne({ where: { userId: req.user.id } });
        if (!twoFactorSecretKey) {
            return next(new ApiError(StatusCodes.NOT_FOUND), 'Two Factor Secret Key not found!');
        }

        const updatedUser = await db.User.update(
            { require2FA: false },
            { where: { id: req.user.id }, returning: true },
        );
        req.session.passport.user.is2FAVerified = false;

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: {
                ...updatedUser,
                is2FAVerified: req.session.passport.user.is2FAVerified,
                lastLogin: req.session.passport.user.lastLogin,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    signup,
    logout,
    verifyServices,
    loginSocial,
    refreshToken,
    getCurrentUser,
    verifyAccount,
    generate2FaQrCode,
    setup2fa,
    verify2fa,
    disable2fa,
};
