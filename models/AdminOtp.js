const mongoose = require("mongoose");

const AdminOtpSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },

  otp: {
    type: String,
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now,
    expires: 300
  }

});

module.exports = mongoose.model("AdminOtp", AdminOtpSchema);
