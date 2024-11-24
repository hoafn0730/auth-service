const jwt = require('jsonwebtoken');

const createToken = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    } catch (err) {
        console.log(err);
    }
    return token;
};

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;

    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return 'TokenExpiredError';
        }
        // console.log(err);
    }
    return decoded;
};

const extractToken = (authorization) => {
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }

    return null;
};

module.exports = {
    createToken,
    verifyToken,
    extractToken,
};
