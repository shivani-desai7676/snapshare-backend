const Admin = require("../models/Admin");
const AdminOtp = require("../models/AdminOtp");
const { Resend } = require("resend");

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ================= SEND OTP =================
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

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save OTP with expiry (5 minutes)
    await AdminOtp.create({
      email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // ✅ Send Email using Resend
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Admin Login OTP",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      });

      console.log("✅ Email sent via Resend");

    } catch (mailError) {
      console.error("❌ Resend error:", mailError.message);

      // fallback for testing
      console.log("📌 OTP (for testing):", otp);
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Error in sendAdminOtp:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= VERIFY OTP =================
exports.verifyAdminOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const record = await AdminOtp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ Check expiry
    if (record.expiresAt < new Date()) {
      await AdminOtp.deleteOne({ _id: record._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ✅ Delete after success
    await AdminOtp.deleteOne({ _id: record._id });

    return res.json({
      success: true,
      message: "Login Successful",
    });

  } catch (error) {
    console.error("Error in verifyAdminOtp:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};