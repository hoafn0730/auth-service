import httpRequest from '~/utils/httpRequest';

const login = async (data, { params }) => {
    return httpRequest.post(
        '/auth/login',
        {
            ...data,
        },
        { params },
    );
};

const signup = async (data) => {
    return httpRequest.post('/auth/signup', {
        ...data,
    });
};

const logout = async () => {
    return httpRequest.get('/auth/logout');
};

const getCurrentUser = async () => {
    return httpRequest.get('/auth/current-user');
};

const refreshToken = async () => {
    const res = await httpRequest.post('/auth/refresh-token');
    return res.data;
};

const verifyAccount = async (data) => {
    return httpRequest.patch('/auth/verify-account', data);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, signup, logout, getCurrentUser, refreshToken, verifyAccount };
