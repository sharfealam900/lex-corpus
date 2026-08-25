import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import SignupOTP from "../models/signupOtp.model.js";

const MAX_OTP_ATTEMPTS = 5;
const OTP_EXPIRY = 10 * 60 * 1000;

const createTokenCookie = (res, token) => {
  return res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const generateOTP = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

const generateOTPHash = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

const verifyOTPHash = (otp, hash) => {
  const incomingHash = generateOTPHash(otp);

  return crypto.timingSafeEqual(
    Buffer.from(incomingHash),
    Buffer.from(hash)
  );
};

const clearResetOTP = (user) => {
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  user.resetOTPAttempts = 0;
};

export const registerUser = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      password,
    } = req.body;

    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    await User.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      role: "user",
      provider: "local",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return createTokenCookie(res, token)
      .status(200)
      .json({
        success: true,
        message: "Login successful.",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profileImage: user.profileImage,
          address: user.address,
        },
      });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential missing.",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google credential.",
      });
    }

    const {
      sub,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email || !email_verified) {
      return res.status(400).json({
        success: false,
        message:
          "Google email is not verified.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      user = await User.create({
        fullname: name?.trim() || "Google User",
        email: normalizedEmail,
        phoneNumber: "",
        password: "",
        profileImage: picture || "",
        googleId: sub,
        provider: "google",
        role: "user",
      });
    } else if (
      user.provider === "google" &&
      !user.googleId
    ) {
      user.googleId = sub;
      user.profileImage =
        picture || user.profileImage;
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return createTokenCookie(res, token)
      .status(200)
      .json({
        success: true,
        message: "Google login successful.",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profileImage: user.profileImage,
          address: user.address,
        },
      });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const genericMessage =
      "If an account exists for this email, an OTP has been sent.";

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    const otp = generateOTP();
    const otpHash = generateOTPHash(otp);

    user.resetOTP = otpHash;
    user.resetOTPExpire =
      Date.now() + OTP_EXPIRY;
    user.resetOTPAttempts = 0;

    await user.save();

    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Lex Corpus Password Reset</h2>
        <p>Hello ${user.fullname},</p>
        <p>Your password reset OTP is:</p>
        <h1 style="letter-spacing:5px">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `;

    await sendEmail(
      user.email,
      "Password Reset OTP",
      html
    );

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        expires: new Date(0),
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (
      !user.resetOTP ||
      !user.resetOTPExpire
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No OTP found. Please request a new one.",
      });
    }

    if (
      Date.now() > user.resetOTPExpire
    ) {
      clearResetOTP(user);
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (
      (user.resetOTPAttempts || 0) >=
      MAX_OTP_ATTEMPTS
    ) {
      clearResetOTP(user);
      await user.save();

      return res.status(400).json({
        success: false,
        message:
          "Too many invalid attempts. Please request a new OTP.",
      });
    }

    if (
      otp.length !== 6 ||
      !/^\d{6}$/.test(otp) ||
      !verifyOTPHash(otp, user.resetOTP)
    ) {
      user.resetOTPAttempts =
        (user.resetOTPAttempts || 0) + 1;

      if (
        user.resetOTPAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        clearResetOTP(user);
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      password,
      confirmPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (
      !user.resetOTP ||
      !user.resetOTPExpire
    ) {
      return res.status(400).json({
        success: false,
        message: "Please request a new OTP.",
      });
    }

    if (
      Date.now() > user.resetOTPExpire
    ) {
      clearResetOTP(user);
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (
      (user.resetOTPAttempts || 0) >=
      MAX_OTP_ATTEMPTS
    ) {
      clearResetOTP(user);
      await user.save();

      return res.status(400).json({
        success: false,
        message:
          "Too many invalid attempts. Please request a new OTP.",
      });
    }

    if (
      otp.length !== 6 ||
      !/^\d{6}$/.test(otp) ||
      !verifyOTPHash(otp, user.resetOTP)
    ) {
      user.resetOTPAttempts =
        (user.resetOTPAttempts || 0) + 1;

      if (
        user.resetOTPAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        clearResetOTP(user);
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    user.password = await bcrypt.hash(
      password,
      12
    );

    clearResetOTP(user);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .select("-password -resetOTP -resetOTPExpire -resetOTPAttempts")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendSignupOTP = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      password,
    } = req.body;

    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    await SignupOTP.deleteOne({
      email: normalizedEmail,
    });

    const otp = generateOTP();
    const otpHash = generateOTPHash(otp);

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    await SignupOTP.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      otp: otpHash,
      otpExpire: Date.now() + OTP_EXPIRY,
      otpAttempts: 0,
    });

    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Welcome to Lex Corpus</h2>
        <p>Your verification OTP is:</p>
        <h1 style="letter-spacing:5px">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `;

    await sendEmail(
      normalizedEmail,
      "Verify Your Email",
      html
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(
      "Send signup OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const completeSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const signupData =
      await SignupOTP.findOne({
        email: normalizedEmail,
      });

    if (!signupData) {
      return res.status(400).json({
        success: false,
        message:
          "OTP expired. Please register again.",
      });
    }

    if (
      Date.now() > signupData.otpExpire
    ) {
      await SignupOTP.deleteOne({
        email: normalizedEmail,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    if (
      (signupData.otpAttempts || 0) >=
      MAX_OTP_ATTEMPTS
    ) {
      await SignupOTP.deleteOne({
        email: normalizedEmail,
      });

      return res.status(400).json({
        success: false,
        message:
          "Too many invalid attempts. Please register again.",
      });
    }

    if (
      otp.length !== 6 ||
      !/^\d{6}$/.test(otp) ||
      !verifyOTPHash(otp, signupData.otp)
    ) {
      signupData.otpAttempts =
        (signupData.otpAttempts || 0) + 1;

      if (
        signupData.otpAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        await SignupOTP.deleteOne({
          email: normalizedEmail,
        });
      } else {
        await signupData.save();
      }

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await SignupOTP.deleteOne({
        email: normalizedEmail,
      });

      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    await User.create({
      fullname: signupData.fullname,
      email: signupData.email,
      phoneNumber: signupData.phoneNumber,
      password: signupData.password,
      role: "user",
      provider: "local",
    });

    await SignupOTP.deleteOne({
      email: normalizedEmail,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error(
      "Complete signup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const resendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const signup =
      await SignupOTP.findOne({
        email: normalizedEmail,
      });

    if (!signup) {
      return res.status(400).json({
        success: false,
        message: "Please register again.",
      });
    }

    const otp = generateOTP();
    const otpHash = generateOTPHash(otp);

    signup.otp = otpHash;
    signup.otpExpire =
      Date.now() + OTP_EXPIRY;
    signup.otpAttempts = 0;

    await signup.save();

    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Lex Corpus</h2>
        <p>Your new verification OTP is:</p>
        <h1 style="letter-spacing:5px">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `;

    await sendEmail(
      normalizedEmail,
      "Signup Verification OTP",
      html
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(
      "Resend signup OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};