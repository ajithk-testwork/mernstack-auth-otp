import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import resendEmail from "../utils/resendEmail.js";

// Register User

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({ message: "User already exits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let profileImage = null;
    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      profileImage,
    });

    res.status(200).json({
      message: " User Register Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Get All User

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Read Single User

export const getUserId = async (req, res) => {
  try {
   
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        message: "Access denied: You can only access your own data",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Update Users

export const updateUser = async (req, res) => {
  try {
    
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        message: "Access denied: You can only update your own account",
      });
    }

    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true },
    );
    res.json(user);
  } catch (error) {
    return res.status(500).jeson({ message: error.message });
  }
};

// Delete User

export const deleteUser = async (req, res) => {
  try {
    
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        message: "Access denied: You can only update your own account",
      });
    }

    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User delete Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//User Login

export const loginUser = async (req, res) => {
  try {

    
    const { email, password } = req.body;
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    user.isLoggedIn = true;
    user.token = token;
    await user.save();

    res.json({
      message: "Login Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isLoggedIn: user.isLoggedIn,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const otp = crypto.randomInt(100000, 1000000).toString();

    
    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpire = Date.now() + 10 * 60 * 1000;

    await user.save(); 

    console.log("OTP GENERATED & SAVED:", otp); 

    
    await resendEmail(
      user.email,
      "Reset Password OTP",
      `<h2>Your OTP is ${otp}</h2>`
    );

    res.json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//verified OTP

export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    otp = otp.toString().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("OTP from frontend:", otp);
    console.log("OTP from DB:", user.forgotPasswordOtp);

    if (!user.forgotPasswordOtpExpire || user.forgotPasswordOtpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.forgotPasswordOtp !== otp) {
      return res.status(400).json({ message: "OTP does not match" });
    }

    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//resetPasswod

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.forgotPasswordOtp = undefined;
    user.forgotPasswordOtpExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//User Logout

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;

    user.isLoggedIn = false;
    user.token = null;
    await user.save();

    res.json({ message: "Logout Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Profile Image Upload

export const uploadProfileImage = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You can upload only your own image" });
    }

   

    if (!req.file) {
      return res.status(400).json({ message: "No image Uploaded" });
    }

    
    const user = await User.findById(req.params.id);

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Image uploaded Successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
