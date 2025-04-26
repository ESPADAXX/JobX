const { body, validationResult } = require('express-validator');

const RegisterValidation = [
    body('fullName').trim().isLength({ min: 1 }).withMessage('Full name is required').escape(),
    body('email')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address').escape(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').escape()
];

const handleRegisterValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));
        return res.status(400).json({ success: false, errors: errorMessages });
    }

    // If there are no validation errors, call next() to proceed to the next middleware or route handler
    next();
};

module.exports = { RegisterValidation, handleRegisterValidationErrors };