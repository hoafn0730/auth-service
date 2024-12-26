import { ADD_NEW_NOTIFICATION } from '../types';

const addNewNotification = (payload) => {
    return { type: ADD_NEW_NOTIFICATION, payload: payload };
};

export { addNewNotification };
