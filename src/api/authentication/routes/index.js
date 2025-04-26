const router = require('express').Router();
const { register, login, logout, ressetPassword, refreshToken, checkRefreshToken } = require('../controller/index');
const { RegisterValidation, handleRegisterValidationErrors } = require('../middleware/validationDataRegister');
const { loginValidation, handleLoginValidationErrors } = require('../middleware/validationDataLogin');
const { verifyForEmail } = require('../middleware/verifyForEmail');
const { verifyPassword } = require('../middleware/verifyForPassword');
const isAuthenticated = require('../../../middleware/isAuthenticate');

// Removed router.post('/google-login', googleLogin);
router.post("/register", RegisterValidation, handleRegisterValidationErrors, register);
router.post("/login", loginValidation, handleLoginValidationErrors, login);
router.post("/logout", isAuthenticated, logout);
router.post("/verify", verifyForEmail);
router.post("/resset-password", ressetPassword);
router.post("/verifyPassword", verifyPassword);
router.post('/refresh-token', refreshToken);
router.get('/check-refresh-token', checkRefreshToken);

module.exports = router;
