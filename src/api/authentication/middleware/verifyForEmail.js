const User = require('../../../models/User');
const generateTokens = require('../../../middlewares/generateTokens');

exports.verifyForEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { verificationCode: code, isVerified: false },
            { $set: { isVerified: true, verificationCode: undefined } },
            { new: true }
        );
        console.log("user", user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already verified'
            });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        console.log("accessToken", accessToken);
        user.refreshToken = refreshToken;
        await user.save();

        // Set the refresh token as an HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).send({
            success: true,
            token: accessToken,
            id: user._id,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};