const mongoose = require('mongoose');

// Define the schema for the wallet address
const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
  accountId: { type: String, required: true },
  addressIndex: { type: Number, required: true },
  blockchain: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  valid: { type: Boolean, default: false }, 
  validChecksum: { type: Boolean, default: false },
  internal: { type: Boolean, default: false }, 
});

// Create the model

module.exports = mongoose.model('Wallet', walletSchema);

