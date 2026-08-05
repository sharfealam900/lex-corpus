import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import SignupOTP from "../models/signupOtp.model.js";

// ==========================
// Register User
// ==========================
export const registerUser = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;

    // Validate required fields
    if (!fullname || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "user", // Every registered user is a normal user
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Login User
// ==========================
export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log("USER:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    console.log("Entered Password:", password);
    console.log("DB Password:", user.password);

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password Match:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
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
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


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

    const {
      sub,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified.",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullname: name,
        email,
        phoneNumber: "",
        password: "",
        profileImage: picture,
        googleId: sub,
        provider: "google",
        role: "user",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Google login failed.",
    });
  }
};




export const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password API called");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Lex Corpus Password Reset</h2>

        <p>Hello ${user.fullname},</p>

        <p>Your OTP is:</p>

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
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// ==========================
// Logout User
// ==========================
export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });

  } catch (error) {
    console.error(error);

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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.resetOTP || !user.resetOTPExpire) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    if (Date.now() > user.resetOTPExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (user.resetOTP !== otp) {
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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};






export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
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
        message: "Password must be at least 8 characters.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.resetOTP || !user.resetOTPExpire) {
      return res.status(400).json({
        success: false,
        message: "Please request a new OTP.",
      });
    }

    if (Date.now() > user.resetOTPExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




// ==========================
// Get Logged-in User Profile
// ==========================
export const getProfile = async (req, res) => {
  try {
    console.log("Searching user:", req.id);

    const user = await User.findById(req.id).select("-password");

    console.log("Found user:", user);

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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




export const sendSignupOTP = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;

    if (!fullname || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Delete previous OTP if exists
    await SignupOTP.deleteOne({ email });

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    await SignupOTP.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
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
      email,
      "Verify Your Email",
      html
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};




export const completeSignup = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const signupData = await SignupOTP.findOne({ email });

    if (!signupData) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
      });
    }

    if (Date.now() > signupData.otpExpire) {

      await SignupOTP.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });

    }

    if (signupData.otp !== otp) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });

    }

    await User.create({

      fullname: signupData.fullname,
      email: signupData.email,
      phoneNumber: signupData.phoneNumber,
      password: signupData.password,
      role: "user",

    });

    await SignupOTP.deleteOne({ email });

    return res.status(201).json({

      success: true,
      message: "Account created successfully.",

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: "Internal Server Error",

    });

  }

};




export const resendSignupOTP = async (req, res) => {
  try {

    const { email } = req.body;

    const signup = await SignupOTP.findOne({ email });

    if (!signup) {
      return res.status(404).json({
        success: false,
        message: "Please register again.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    signup.otp = otp;
    signup.otpExpire = Date.now() + 10 * 60 * 1000;

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
      email,
      "Signup Verification OTP",
      html
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
    });

  }
};


