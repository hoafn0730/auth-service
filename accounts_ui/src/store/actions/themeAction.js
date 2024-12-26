import { CHANGE_THEME } from '../types';

const changeTheme = (isDarkMode) => {
    return { type: CHANGE_THEME, isDarkMode };
};

export { changeTheme };
