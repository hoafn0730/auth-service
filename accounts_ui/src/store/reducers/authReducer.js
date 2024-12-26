import { USER_LOGIN_FAILED, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT } from '../types';

const INITIAL_STATE = {
    userInfo: null,
    isLogin: false,
    isLoading: false,
    error: '',
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST: {
            return {
                ...state,
                userInfo: null,
                isLoading: true,
                error: '',
            };
        }
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                userInfo: {
                    ...action.payload,
                },
                isLogin: true,
                isLoading: false,
                error: '',
            };

        case USER_LOGIN_FAILED:
            return {
                ...state,
                userInfo: null,
                isLoading: false,
                error: action.error,
            };

        case USER_LOGOUT:
            return {
                ...state,
                userInfo: null,
                isLogin: false,
                isLoading: false,
                error: '',
            };

        default:
            return state;
    }
};

export default authReducer;
