const { StatusCodes } = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
const errorHandlingMiddleware = (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
        stack: err.stack,
    };

    // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi.
    if (process.env.BUILD_MODE !== 'dev') delete responseError.stack;

    // eslint-disable-next-line no-console
    console.error(responseError);

    // Trả responseError về phía Front-end
    res.status(responseError.statusCode).json(responseError);
};

module.exports = errorHandlingMiddleware;
