import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authReducer';
import modalReducer from './modalReducer';
import notificationReducer from './notificationReducer';
import themeReducer from './themeReducer';

const authPersistConfig = {
    key: 'auth',
    storage: storage,
    whitelist: ['userInfo'],
};

const rootReducer = combineReducers({
    user: persistReducer(authPersistConfig, authReducer),
    modal: modalReducer,
    notification: notificationReducer,
    theme: themeReducer,
});

export default rootReducer;
