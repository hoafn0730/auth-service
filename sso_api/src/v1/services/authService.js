const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const salt = bcrypt.genSaltSync(10);

const doHashPassword = (password) => {
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
};

const checkEmailExist = async (email) => {
    const user = await db.User.findOne({ where: { email: email } });

    return !!user;
};

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
};

const login = async (data) => {
    try {
        const user = await db.User.findOne({ where: { email: data.email, type: 'LOCAL' } });

        if (user) {
            const isCorrectPassword = checkPassword(data.password, user.password);

            if (!isCorrectPassword) {
                return {
                    statusCode: 1,
                    message: 'Password is incorrect!',
                };
            }

            delete user.dataValues.password;

            return {
                ...user.dataValues,
                code: uuidv4(),
            };
        } else {
            return {
                statusCode: 1,
                message: 'email is incorrect!',
            };
        }
    } catch (error) {
        throw error;
    }
};

const signup = async (data) => {
    try {
        const isEmailExist = await checkEmailExist(data.email);
        if (isEmailExist) {
            return {
                statusCode: 1,
                message: 'Email is already exist!',
            };
        }

        const hashPassword = doHashPassword(data.password);

        await db.User.create({
            email: data.email,
            username: data.username,
            password: hashPassword,
            fullName: data.username,
            role: 'user',
        });

        return {
            statusCode: 0,
            message: 'A user is created successfully!',
        };
    } catch (error) {
        throw error;
    }
};

const updateUserCode = async (type, email, token) => {
    try {
        await db.User.update(
            { code: token },
            {
                where: { email: email, type },
            },
        );
    } catch (error) {
        throw error;
    }
};

module.exports = { login, signup, updateUserCode };
