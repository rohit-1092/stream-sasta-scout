const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Ensure this path is correct

// --- Nodemailer Setup ---
// --- Nodemailer Setup (Environment Variables ke saath) ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Render dashboard se Jayindian10@gmail.com uthayega
    pass: process.env.EMAIL_PASS  // Render dashboard se uhdpydhjqbcmciny uthayega
  }
});

// 1. REGISTER ROUTE (User banane ke liye)
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

        // 6 digit random OTP generate karna
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000; // 10 minutes valid
        await user.save();

        // Email bhejne ka logic
        await transporter.sendMail({
            from: '"Sasta Scout" <jayindian10@gmail.com>', // Syntax corrected
            to: email,
            subject: "Login Verification Code",
            text: `Aapka Sasta Scout OTP hai: ${otp}`
        });

        res.json({ msg: "OTP email par bhej diya gaya hai" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. VERIFY OTP & LOGIN ROUTE
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        // OTP aur expiry check karna
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid ya Expired OTP" });
        }

        // Login ke liye JWT token banana
        const token = jwt.sign({ id: user._id }, 'SASTA_SCOUT_SECRET', { expiresIn: '24h' });

        // OTP use hone ke baad clear karna
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

        // OTP aur expiry check karein
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid ya Expired OTP" });
        }

        // Naye password ko hash (encrypt) karein
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // OTP clear karein aur save karein
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ msg: "Password successfully change ho gaya hai! Ab login karein." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;