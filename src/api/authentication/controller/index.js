const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const { sendEmail } = require("../../../middleware/sendEmail");
const generateTokens = require("../../../middleware/generateTokens");

dotenv.config();

const generateVerificationCode = () => {
    // Generate a random 6-digit code
    return Math.floor(100000 + Math.random() * 900000);
};

exports.register = async (req, res) => {
    const { email, fullName, password, confirmPassword, role } = req.body;
    // if (password !== confirmPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Passwords do not match.",
    //   });
    // }
    try {
        const existingUser = await User.findOne({ email }); // Replaced readOne with Mongoose's findOne
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: "User already exists.",
            });
        } else {
            const verificationCode = generateVerificationCode();
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                role: role || 'client', // Default to 'client' if no role is provided
                verificationCode,
            });
            await newUser.save(); // Save the new user using Mongoose

            const successMessage =
                "User registered successfully. Verification email sent.";
            const path = "./src/view/verificationForEmail.ejs";
            const response = await sendEmail(
                {
                    email,
                    successMessage,
                    code: verificationCode,
                    path,
                },
                res
            );
            res.status(201).json(response);
        }
    } catch (err) {
        if (err.name === "MongoError" && err.code === 11000) {
            // duplicate key error
            return res.status(409).json({
                success: false,
                message: "Email already in use.",
            });
        } else {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }
    }
};

exports.login = async (req, res) => {
    let { email, password } = req.body;
    try {
        const user = await User.findOne({ email }); // Replaced readOne with Mongoose's findOne
        if (!user) {
            return res
                .status(401)
                .send({ success: false, message: "Invalid email or password" });
        }
        
        const passwordMatch = password && user.password ?
        await bcrypt.compare(password, user.password) :
        false;

        if (!passwordMatch) {
            return res
                .status(401)
                .send({ success: false, message: "Invalid email or password" });
            }
            
        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save(); // Save the updated user using Mongoose

        // Set the refresh token as an HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(201).send({
            success: true,
            accessToken,
            id: user._id,
            profileCreation: user.profileCreation,
            message: "Login successful. Welcome back!",
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ success: false, message: "Internal server error" });
    }
};

exports.ressetPassword = async (req, res) => {
    const { email } = req.body;

    const verificationCode = generateVerificationCode();

    await User.findOneAndUpdate({ email }, { $set: { verificationCode } });

    const successMessage = "Verification email sent for password reset.";
    const path = "./src/view/verificationForPassword.ejs";
    const response = await sendEmail(
        {
            email,
            successMessage,
            code: verificationCode,
            path,
        },
        res
    );
    res.status(201).json(response);
};

exports.logout = (req, res) => {
    // Check if a valid token is present in the session
    if (!req.session.token) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized. No valid session.",
        });
    }

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send({ success: false, message: "Internal server error" });
        }

        return res.status(200).send({
            success: true,
            message: "Logged out successfully",
        });
    });
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "Refresh token is required" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: user._id, fullName: user.fullName, role: user.role },
            process.env.JWT_KEY_SECRET,
            {
                expiresIn: "15m",
            }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

exports.checkRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) throw new Error("Invalid token");

        return res.status(200).json({ success: true, message: "Valid refresh token" });
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }
};
