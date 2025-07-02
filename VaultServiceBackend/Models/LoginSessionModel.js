const mongoose = require("mongoose");

const loginSessionSchema = new mongoose.Schema({
  user_vault_id: String,
  email: String,
  sessionId: String,
  device: String,
  platform: String,
  status: { type: Number, default: 1 },
  isActiveNow: { type: Boolean, default: true },
  loginTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoginSession", loginSessionSchema);
