import { CLOSE_MODAL, CLOSING_MODAL, OPEN_MODAL } from '../types';

const openModal = () => {
    return { type: OPEN_MODAL };
};

const closingModal = () => {
    return { type: CLOSING_MODAL };
};
const closeModal = () => {
    return { type: CLOSE_MODAL };
};

export { openModal, closingModal, closeModal };
