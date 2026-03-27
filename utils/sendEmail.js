const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // required for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // ⏱️ prevent long wait (10 sec)
    });

    // ✅ Send mail
    const info = await transporter.sendMail({
      from: `"SnapShare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SnapShare OTP Verification",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);

    // ❗ IMPORTANT: Do NOT throw error (prevents 500 crash)
    return false;
  }
};

module.exports = sendEmail;