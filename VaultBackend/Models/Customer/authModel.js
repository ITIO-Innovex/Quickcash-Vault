const mongoose = require('mongoose');

const vaultUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }, 
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  userId: { type: String },
  scope: { type: String },
  expiresIn: { type: Number },
  accessTokenExpiresAt: { type: Date }, // Track when access token expires
  refreshTokenCreatedAt: { type: Date }, // Track when refresh token was issued
  sumsubToken: { type: String },
  upgradedToken: { type: String }, // New field to store Sumsub token
}, { timestamps: true });

module.exports = mongoose.model('VaultUser', vaultUserSchema);
