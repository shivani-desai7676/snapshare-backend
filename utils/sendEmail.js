const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // important
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,   // ✅ FIX timeout
      greetingTimeout: 10000,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SnapShare OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error; // 🔥 IMPORTANT (so API returns proper error)
  }
};

module.exports = sendEmail;