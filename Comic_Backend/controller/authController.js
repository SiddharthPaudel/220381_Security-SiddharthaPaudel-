// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Correct way to import the User model
import crypto from 'crypto';
import sanitize from "mongo-sanitize";
import nodemailer from 'nodemailer';
import axios from 'axios';
import sendEmail from '../utils/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
// Signup Controller
// export const signupController = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ msg: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ name, email, password: hashedPassword });

//     res.status(201).json({ msg: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Signup failed' });
//   }
// };

export const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // ✅ Email format validation (very basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        msg: 'Please provide a valid email address.',
      });
    }

    // ✅ Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
    }

    // ✅ Create user (assuming password hashing in your model's pre-save hook)
    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
};


// Login Controller


const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30 mins lock

export const loginController = async (req, res) => {
  let { email, password, otp, captchaToken } = req.body;

  // ✅ Basic Input Checks
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  if (!otp && !captchaToken) {
    return res.status(400).json({ msg: "Captcha token is required" });
  }

  try {
    // ✅ Sanitize email to prevent NoSQL injection
    email = sanitize(email);

    // ✅ CAPTCHA verification (if OTP not sent yet)
    if (!otp) {
      const params = new URLSearchParams();
      params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
      params.append("response", captchaToken);

      const response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        params.toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("Google reCAPTCHA response:", response.data);

      if (!response.data.success) {
        return res.status(400).json({
          msg: "Captcha verification failed",
          errors: response.data["error-codes"],
        });
      }
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // ✅ Password Expiry Check (90 days)
    const PASSWORD_EXPIRY_DAYS = 90;
    const passwordExpired = (user) => {
      if (!user.passwordChangedAt) return false;
      const expiryDate = new Date(user.passwordChangedAt);
      expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
      return expiryDate < new Date();
    };

    if (passwordExpired(user)) {
      return res.status(403).json({
        msg: "Your password has expired. Please reset your password.",
      });
    }

    // ✅ Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        msg: `Account locked. Try again after ${new Date(
          user.lockUntil
        ).toLocaleTimeString()}`,
      });
    }

    // ✅ Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }

      await user.save();
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Password matches
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    // ✅ OTP handling
    if (!otp) {
      const generatedOtp = crypto.randomInt(100000, 999999).toString();
      user.otpCode = generatedOtp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      await sendEmail(user.email, "Your Login OTP", `Your OTP is: ${generatedOtp}`);

      return res.status(200).json({
        msg: "OTP sent to your email. Please verify to complete login.",
        requireOtp: true,
      });
    }

    // ✅ Validate OTP
    if (otp !== user.otpCode || Date.now() > user.otpExpires) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // ✅ Clear OTP fields
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    // ✅ Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, avatar } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (avatar !== undefined) {
      // Validate avatar ID between 1 and 6
      if (avatar >= 1 && avatar <= 6) {
        updateData.avatar = avatar;
      } else {
        return res.status(400).json({ message: 'Invalid avatar selection' });
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};


// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, exclude password field for security
    const users = await User.find().select('-password');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token (random string)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and set to user
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashedToken;

    // Token expiry: 1 hour
    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    // Create reset URL with plain token (not hashed)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>This link expires in 1 hour.</p>`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    // Hash the token from URL param to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // Update password (this triggers pre-save hook with reuse check)
    user.password = newPassword;

    // Save user and catch reuse error if thrown
    await user.save();

    // Clear reset tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    // Check if error is password reuse error from pre-save hook
    if (err.message.includes("New password must not match")) {
      return res.status(400).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
