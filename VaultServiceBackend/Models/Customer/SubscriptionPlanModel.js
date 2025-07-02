const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VaultUser",
      required: true,
    },
    vaultSubscriptionId: String,
    payUrl: String, // Optional
    subscriptionDetails: {
      subscriptionId: String,
      name: String,
      description: String,
      amount: Number,
      currency: String,
      initialPaymentAmount: Number,
      subscriptionInterval: String,
      trialAvailable: Boolean,
      level: Number,
      mostPopular: Boolean,
    },
    status: String,
    nextPaymentDate: Date,
    lastPaymentInvoiceId: String,
    lastPaymentInvoiceStatus: String,
    startedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
