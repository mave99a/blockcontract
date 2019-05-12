/* eslint-disable camelcase */
const mcrypto = require('@arcblock/mcrypto');
const did = require('@arcblock/did');
const sendmail = require('sendmail')({ silent: true });
const { Contract } = require('../models');

const types = mcrypto.types;

const sha3 = mcrypto.getHasher(mcrypto.types.HashType.SHA3);

function gen_contract_did(requester, content_hash, signatures) {
  const info = JSON.stringify(signatures.map(sig => ({ name: sig.name, email: sig.email })));
  const hash = content_hash.replace('0x', '').toLowerCase();
  const data = sha3(`${requester}${hash}${info}`);
  const did_type = {
    role: types.RoleType.ROLE_ASSET, // temp type
    pk: types.KeyType.ED25519,
    hash: types.HashType.SHA3,
  };
  return did.fromPublicKey(data, did_type);
}

function send_one_email(from, to, subject, html) {
  return new Promise((res, rej) => {
    const email = {
      from,
      to,
      replyTo: from,
      subject,
      html,
    };
    res({});
    // disable email for now
    // sendmail(email, (err, reply) => {
    //   if (err) return rej(err);
    //   return res(reply);
    // });
  });
}

function send_emails(from, recipients, subject, html) {
  const all_emails = recipients.map(r => send_one_email(from, r, subject, html));
  return Promise.all(all_emails);
}

function get_html(content_bin, signatures) {
  return 'hello world!';
}

module.exports = {
  init(app) {
    app.put('/api/contracts', async (req, res) => {
      // we need a better auth module, for api it shall use the tokens taken from the http header (Authorization: bearer <token>)

      const user = req.session.user;
      console.log(user);
      if (!user || !user.did) return res.status(403).json(null);

      // need some basic param verification

      const params = req.body;
      // in the form when it post the content it shall use Buffer.from(content).toString('base64'). This will
      // work for both text and later on pdf.
      const content_bin = Buffer.from(params.content, 'base64');
      console.log(content_bin);
      const hash = sha3(content_bin);
      const content_did = gen_contract_did(params.requester, hash, params.signatures);

      const c = await Contract.findOne({ _id: content_did });

      if (c) {
        return res.status(422).json(null);
      }

      const requester = req.session.user;
      const signatures = params.signatures;

      const now = new Date();
      const attrs = {
        _id: content_did,
        requester: requester.did,
        synopsis: params.synopsis,
        content: content_bin,
        hash,
        signatures,
        createdAt: now,
        updatedAt: now,
      };
      const contract = new Contract(attrs);

      await contract.save();

      const html = get_html(content_bin, signatures);
      const recipients = signatures.map(v => v.email);
      await send_emails(requester.email, recipients, `Please sign:${params.synopsis}`, html);
      res.json(attrs);
    });

    app.get('/api/contracts', async (req, res) => {
      console.log(req.session.user);
      const contracts = await Contract.find({
        $or: [{ 'signatures.email': req.session.user.email }, { requester: req.session.user.did }],
      });
      res.json(contracts ? contracts.map(c => c.toObject()) : []);
    });

    app.get('/api/contracts/:contractId', async (req, res) => {
      try {
        const contract = await Contract.findById(req.params.contractId);
        res.json(contract);
      } catch (err) {
        console.error(err);
        res.status(404).json(null);
      }
    });
  },
};
