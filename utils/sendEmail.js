const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

try {
  await resend.emails.send({
    from: "onboarding@resend.dev", // default working sender
    to: email,
    subject: "Admin Login OTP",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  console.log("✅ Email sent via Resend");

} catch (err) {
  console.error("❌ Resend error:", err.message);

  // fallback
  console.log("📌 OTP (for testing):", otp);
}