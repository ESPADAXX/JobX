const { body, validationResult } = require('express-validator');
const xss = require('xss');

const loginValidation = [
    body('email')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .customSanitizer((value) => xss(value)).escape(), // Sanitize the email input with xss

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .customSanitizer((value) => xss(value)).escape(), // Sanitize the password input with xss
    // .matches(/^[a-zA-Z0-9!._]+$/, 'i')
    // .withMessage('Password must be alphanumeric with !, ., or _')
];

const handleLoginValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => ({
            field: error.param,
            message: error.msg,
        }));

        return res.status(400).json({ success: false, errors: errorMessages });
    }

    // If there are no validation errors, call next() to proceed to the next middleware or route handler
    next();
};

module.exports = { loginValidation, handleLoginValidationErrors };