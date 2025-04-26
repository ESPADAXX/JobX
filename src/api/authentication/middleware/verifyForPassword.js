const Account = require('../../../models/User')
const jwt = require("jsonwebtoken")
exports.verifyPassword = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await Account.findOne({ verificationCode: code });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already verified'
            });
        }
        // Mark the user as verified and clear the verification token
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();
        return res.status(201).send({
            success: true,
            message: "email verified successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}