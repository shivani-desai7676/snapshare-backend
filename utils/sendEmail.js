const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Admin Login OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    console.log("✅ Email sent via Resend");

  } catch (error) {
    console.error("❌ Resend error:", error.message);

    // fallback
    console.log("📌 OTP (for testing):", otp);
  }
};

module.exports = sendEmail;