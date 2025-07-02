const mongoose = require('mongoose');

const sumsubKycSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VaultUser', 
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['init', 'pending', 'approved', 'rejected'], // customize if needed
    default: 'init'
  },
  attemptCnt: {
    type: Number,
    default: 0
  },
  attemptId: {
    type: String
  },
  levelName: {
    type: String
  },
  reviewId: {
    type: String
  },
  reviewDate: {
    type: Date
  },
  reviewResult: {
  type: Object,
  default: null
},
  createDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('SumsubKyc', sumsubKycSchema);
