import authService from '~/services/authService';
import { USER_LOGIN_FAILED, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from '../types';

const doLogin = (payload) => {
    return (dispatch) => {
        dispatch({ type: USER_LOGIN_REQUEST });

        authService
            .login(payload)
            .then((res) => {
                if (res.code === 0) {
                    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
                    window.location.reload();
                } else {
                    dispatch({ type: USER_LOGIN_FAILED, error: res.message });
                }
            })
            .catch((err) => {
                dispatch({ type: USER_LOGIN_FAILED });
            });
    };
};

const doLogout = () => {
    return (dispatch) => {
        authService
            .logout()
            .then((res) => {
                if (res.data.statusCode === 200) {
                    dispatch({ type: USER_LOGOUT });
                    const delay = new Promise((resolve) => setTimeout(resolve, 500));
                    delay.then(() => (window.location.href = '/'));
                }
            })
            .catch((err) => {
                dispatch({ type: USER_LOGIN_FAILED });
            });
    };
};

const doGetAccount = () => {
    return (dispatch) => {
        dispatch({ type: USER_LOGIN_REQUEST });

        authService
            .getCurrentUser()
            .then((res) => {
                if (res.statusCode === 200) {
                    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
                } else {
                    dispatch({ type: USER_LOGIN_FAILED });
                }
            })
            .catch((err) => {
                dispatch({ type: USER_LOGIN_FAILED });
            });
    };
};

const clearAccount = () => {
    return { type: USER_LOGOUT };
};

export { doLogin, doLogout, doGetAccount, clearAccount };
