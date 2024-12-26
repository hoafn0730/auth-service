import httpRequest from '~/utils/httpRequest';

const updateProfile = async (data) => {
    return httpRequest.patch('/profile', data, {
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        // },
    });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { updateProfile };
