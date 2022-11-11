exports.create = function(accounts, certs) {
  const store = {};

  store.accounts = {
    setKeypair: function(opts) {
      const id = (opts.account && opts.account.id) || opts.email || 'default';
      return accounts.updateOne({ id: id }, { $set: {
          id,
          privateKeyPem: opts.keypair.privateKeyPem,
          privateKeyJwk: opts.keypair.privateKeyJwk
        }}, { upsert: true });
    },
    checkKeypair: function(opts) {
      const id = (opts.account && opts.account.id) || opts.email || 'default';
      return accounts.findOne({ id: id });
    }
  };

  store.certificates = {
    setKeypair: function(opts) {
      const id = (opts.certificate && (opts.certificate.kid || opts.certificate.id)) || opts.subject;
      return certs.updateOne({ id: id }, { $set: {
          id: id,
          privateKeyPem: opts.keypair.privateKeyPem,
          privateKeyJwk: opts.keypair.privateKeyJwk
        }}, { upsert: true });
    },
    checkKeypair: function(opts) {
      const id = (opts.certificate && (opts.certificate.kid || opts.certificate.id)) || opts.subject;
      return certs.findOne({ id: id });
    },
    set: function(opts) {
      const id = (opts.certificate && opts.certificate.id) || opts.subject;
      return certs.updateOne({ id: id }, { $set: {
          id: id,
          cert: opts.pems.cert,
          chain: opts.pems.chain,
          subject: opts.pems.subject,
          altnames: opts.pems.altnames,
          issuedAt: opts.pems.issuedAt,
          expiresAt: opts.pems.expiresAt
        }}, { upsert: true });
    },
    check: function(opts) {
      const id = (opts.certificate && opts.certificate.id) || opts.subject;
      return certs.findOne({ id: id });
    }
  };

  return store;
};
