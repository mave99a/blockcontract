const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  did: { type: String, required: true },
  hash: { type: String, default: '' },
  block: { type: Number, default: -1 },
  status: { type: String, default: 'created' },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
