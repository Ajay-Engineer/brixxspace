const expressAsyncHandler = require('express-async-handler');
const Otp = require('../models/Otp');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// Generate numeric OTP
const generateNumericOTP = (length) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = expressAsyncHandler(async (req, res) => {
    const { email, type } = req.body; // type: 'signup' or 'forgot-password'

    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (type === 'signup' && userExists) {
        res.status(400);
        throw new Error('Email is already registered. Please login.');
    }

    if (type === 'forgot-password' && !userExists) {
        res.status(404);
        throw new Error('No account found with this email.');
    }

    // Generate OTP
    const otp = generateNumericOTP(6);

    // Save/Update OTP in DB
    // First, remove existing OTPs for this email to avoid duplicates/confusion
    await Otp.deleteMany({ email });

    await Otp.create({
        email,
        otp
    });

    const message = `Your BRIXXSPACE Verification Code is: ${otp}\n\nThis code is valid for 10 minutes.`;

    try {
        await sendEmail({
            email,
            subject: 'Your Verification Code - BRIXXSPACE',
            title: 'Verify Your Email Address',
            otp,
            content: 'Thank you for connecting with BRIXXSPACE. Please use the verification code below to complete your verification request.',
            message,
            footerNote: 'If you did not request this verification code, please disregard this email or contact support.'
        });

        res.status(200).json({
            message: 'OTP sent successfully to ' + email
        });
    } catch (error) {
        console.error("Email send error:", error);
        await Otp.deleteMany({ email }); // Rollback
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = expressAsyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error('Email and OTP are required');
    }

    const record = await Otp.findOne({ email, otp });

    if (!record) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    // If verified, what do we do?
    // For signup, we just tell frontend "OK, proceed to submit form".
    // For forgot password, we might issue a temp "reset token" or just return success and trust the next call includes OTP again?
    // STRICTER SECURITY: Return a signed token that proves OTP was verified, to be included in the next request.
    // FOR SIMPLICITY NOW: Just return success. Frontend sends OTP again with the final payload, OR we can rely on just success status for signup flow (since final register will re-check if user exists, but can't verify OTP again unless we keep it).

    // Better approach: Don't delete OTP yet. Delete it only when used for final action (register or reset password).

    res.status(200).json({
        message: 'OTP verified successfully'
    });
});

module.exports = { sendOtp, verifyOtp };
