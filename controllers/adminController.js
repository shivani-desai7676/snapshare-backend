const Admin = require("../models/Admin");
const AdminOtp = require("../models/AdminOtp");
const nodemailer = require("nodemailer");

// ✅ Create transporter ONCE (better performance)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // prevent long wait
});

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

    // ✅ Try sending email (but don’t crash if fails)
    try {
      await transporter.sendMail({
        from: `"SnapShare Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Admin Login OTP",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      });

      console.log("✅ OTP Email sent");
    } catch (mailError) {
      console.error("❌ Email failed:", mailError.message);

      // 👉 fallback (important for Render issue)
      console.log("📌 OTP (for testing):", otp);
    }

    return res.json({
      success: true,
      message: "OTP sent (check email or console)",
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