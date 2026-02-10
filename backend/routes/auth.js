const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendInBlue = require('nodemailer-sendinblue-transport'); // Naya Transport
const User = require('../models/User');

// --- Updated Nodemailer Setup (Render Friendly) ---
// Note: Ab hum 'service: gmail' use nahi karenge
const transporter = nodemailer.createTransport(
    new sendInBlue({
        apiKey: process.env.BREVO_API_KEY // Render Dashboard mein ye key dalni hogi
    })
);

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ msg: "Registration Successful! Ab OTP mangwaiye." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. SEND OTP ROUTE
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User nahi mila" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; 
        await user.save();

        // Email bhejne ka logic (Ab block nahi hoga)
        await transporter.sendMail({
            from: 'jayindian10@gmail.com', // Brevo par verified email hi use karein
            to: email,
            subject: "Login Verification Code",
            text: `Aapka Sasta Scout OTP hai: ${otp}`,
            html: `<b>Aapka Sasta Scout OTP hai: ${otp}</b>`
        });

        res.json({ msg: "OTP email par bhej diya gaya hai" });
    } catch (err) {
        console.error("Email Error:", err);
        res.status(500).json({ error: "Email bhejane mein galti hui. Check Logs." });
    }
});

// 3. VERIFY OTP & LOGIN ROUTE
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid ya Expired OTP" });
        }

        const token = jwt.sign({ id: user._id }, 'SASTA_SCOUT_SECRET', { expiresIn: '24h' });

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. FORGOT/RESET PASSWORD ROUTE
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid ya Expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ msg: "Password successfully change ho gaya hai! Ab login karein." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;