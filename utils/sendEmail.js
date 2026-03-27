// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    // ✅ Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // your Gmail
        pass: process.env.EMAIL_PASS,       // app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin Login OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Email error:", error.message);

    // fallback: log OTP in console for testing
    console.log("📌 OTP (for testing):", otp);
  }
};

module.exports = sendEmail;