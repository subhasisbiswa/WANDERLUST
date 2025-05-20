module.exports = (fn) => {
    return function (req, res, next) {
        // Call the passed function and catch any errors
        fn(req, res, next).catch(next);  // Automatically forwards the error to the next middleware
    }
};
