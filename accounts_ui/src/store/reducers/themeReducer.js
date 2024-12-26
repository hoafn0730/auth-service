import { CHANGE_THEME } from '../types';

const INITIAL_STATE = {
    isDarkMode: false,
};

const themeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_THEME: {
            return {
                ...state,
                isDarkMode: action.isDarkMode,
            };
        }

        default:
            return state;
    }
};

export default themeReducer;
