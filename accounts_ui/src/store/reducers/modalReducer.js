import { CLOSE_MODAL, CLOSING_MODAL, OPEN_MODAL } from '../types';

const INITIAL_STATE = {
    isOpen: false,
    isClosing: false,
};

const modalReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return {
                ...state,
                isOpen: true,
            };

        case CLOSING_MODAL:
            return {
                ...state,
                isOpen: true,
                isClosing: true,
            };

        case CLOSE_MODAL:
            return {
                ...state,
                isOpen: false,
            };

        default:
            return state;
    }
};

export default modalReducer;
