const ms = require('ms');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

const db = require('../models');
const ApiError = require('../utils/ApiError');
const JwtProvider = require('../providers/JwtProvider');
const { authService } = require('../services/authService');
const { BrevoProvider } = require('../providers/BrevoProvider');

const login = (req, res, next) => {
    const redirectUrl = req.query.continue;
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
                return res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: 'login success' });
            } else {
                return res.redirect(process.env.BACKEND_SSO);
            }
        });
    })(req, res, next);
};

const loginSocial = async (req, res, next) => {
    try {
        const redirectUrl = decodeURIComponent(req.query.state.split(',')[0]);
        const isPopup = req.query.state.split(',')[1] === 'true' && true;

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
        const { data } = await authService.signup(req.body);

        // Send email verify
        const verificationLink = `${process.env.WEBSITE_DOMAIN}/verify-account?email=${data.email}$token=${data.code}`;
        const customSubject = 'Account Verification - Please Confirm Your Email';
        const htmlContent = `
            <h3>Hello, ${data.email}!</h3>
            <p>Thank you for signing up. To complete your account setup, please verify your email address.</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>Click the link above to verify your account and start using our services.</p>
            `;
        await BrevoProvider.sendEmail(data.email, customSubject, htmlContent);

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
        // domain: process.env.COOKIE_DOMAIN
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('connect.sid');
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
        const refreshToken = req.cookies.refreshToken; // Lấy Refresh Token từ cookie
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

const verifyAccount = async (req, res, next) => {
    const { email, token } = req.body;

    try {
        const resData = await authService.verifyAccount('LOCAL', email);

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: resData.message || StatusCodes[StatusCodes.OK],
            data: resData.data,
        });
    } catch (error) {
        next(error);
    }
};

const generate2FaQrCode = async (req, res) => {
    try {
        let twoFactorSecretKeyValue = null;

        // //         const twoFactorSecretKey = await twoFactorSecretKeyDB.findOne({ user_id: req.user.id });
        // //         if (!twoFactorSecretKey) {
        // //             const newTwoFactorSecretKey = await twoFactorSecretKeyDB.insert({
        // //                 user_id: user._id,
        // //                 value: authenticator.generateSecret(),
        // //             });
        // //
        // //             twoFactorSecretKeyValue = newTwoFactorSecretKey.value;
        // //         } else {
        // //             twoFactorSecretKeyValue = twoFactorSecretKey.value;
        // //         }
        // //
        // //         // tao OPT auth token
        // //         const optAuthToken = authenticator.keyuri(user.username, '2fa - hoafn0730', twoFactorSecretKeyValue);
        //
        //         // tao anh qrcode
        //         const qrCodeImageUrl = await QRCode.toDataURL(optAuthToken);
        //
        //         res.status(StatusCodes.OK).json({ data: qrCodeImageUrl });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const setup2FA = async (req, res, next) => {
    const { email, type, token } = req.body;
    console.log('🚀 ~ verifyAccount ~ token:', token);

    try {
        const resData = await authService.verifyAccount(type, email);

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: resData.message || StatusCodes[StatusCodes.OK],
            data: resData.data,
        });
    } catch (error) {
        next(error);
    }
};

const verify2fa = async (req, res) => {
    try {
        //         const twoFactorSecretKey = await twoFactorSecretKeyDB.findOne({ user_id: req.user.id });
        //         if (!twoFactorSecretKey) {
        //             return res.status(StatusCodes.NOT_FOUND).json({ message: 'Two Factor Secret Key not found!' });
        //         }
        //
        //         if (!req.body.otpToken) {
        //             return res.status(StatusCodes.NOT_FOUND).json({ message: 'Otp Token not found!' });
        //         }
        //
        //         const isValid = authenticator.verify({
        //             token: req.body.otpToken,
        //             secret: twoFactorSecretKey.value,
        //         });
        //
        //         if (!isValid) {
        //             return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: 'Invalid opt token!' });
        //         }
        //
        //         // req.user
        //
        //         const updatedUserSession = await UserSessionDB.update(
        //             { _id: user._id, device_id: req.headers['user-agent'] },
        //             { $set: { is_2fa_verified: true } },
        //             { returnUpdatedDocs: true },
        //         );
        //
        //         UserSessionDB.compactDatafileAsync();
        //
        //         res.status(StatusCodes.OK).json({
        //             ...pickUser(user),
        //             is_2fa_verified: updatedUserSession.is_2fa_verified,
        //             last_login: updatedUserSession.last_login,
        //         });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const disable2FA = async (req, res) => {
    try {
        //
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
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
    setup2FA,
    verify2fa,
    disable2FA,
};
