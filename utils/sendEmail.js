const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SnapShare OTP Verification",
      text: `Your OTP is ${otp}`
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

module.exports = sendEmail;
