const Admin = require("../models/Admin");
const AdminOtp = require("../models/AdminOtp");
const nodemailer = require("nodemailer");

// Send OTP
exports.sendAdminOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    await AdminOtp.create({ email, otp });

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail email in .env
        pass: process.env.EMAIL_PASS  // App password if using Gmail
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin Login OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    return res.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.error("Error in sendAdminOtp:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify OTP
exports.verifyAdminOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const record = await AdminOtp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Optionally, delete OTP after verification
    await AdminOtp.deleteOne({ _id: record._id });

    return res.json({ success: true, message: "Login Successful" });

  } catch (error) {
    console.error("Error in verifyAdminOtp:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
