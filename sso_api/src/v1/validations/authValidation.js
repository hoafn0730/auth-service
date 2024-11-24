const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const login = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string().min(6).max(50).required(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const signup = async (req, res, next) => {
    const correctCondition = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string().min(6).max(50).required(),
        repeatPassword: Joi.string().min(6).max(50).optional(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

module.exports = {
    login,
    signup,
};
