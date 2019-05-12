const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  // the did is calculated by sha3(concat(content, hash, signatures list without each sig))
  _id: { type: String, required: true, trim: true },
  requester: { type: String, required: true, trim: true },
  synopsis: { type: String, required: true, trim: true },
  content: { type: Buffer, required: true },
  hash: { type: String, required: true },
  signatures: [
    {
      name: { type: String, trim: true },
      email: { type: String, required: true, trim: true },
      signer: { type: String, trim: true },
      signedAt: { type: Date },
      signature: { type: Buffer },
    },
  ],
  finished: { type: Boolean, default: false },
  asset_did: { type: String, default: '' },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;
