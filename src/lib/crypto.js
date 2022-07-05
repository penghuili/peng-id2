import sodium from 'libsodium-wrappers';

export async function derivePassword(password, salt) {
  await sodium.ready;

  const updatedSalt = salt
    ? sodium.from_hex(salt)
    : sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

  const derived = sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES,
    sodium.from_string(password),
    updatedSalt,
    10000,
    sodium.crypto_pwhash_MEMLIMIT_MIN,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  return { derived: sodium.to_hex(derived), salt: sodium.to_hex(updatedSalt) };
}

export async function generateKeypairs(password, salt) {
  const { derived, salt: usedSalt } = await derivePassword(password, salt);
  const seed = sodium.from_hex(derived);
  const signingKeypair = sodium.crypto_sign_seed_keypair(seed);
  const encryptionKeypair = sodium.crypto_box_seed_keypair(seed);

  return {
    salt: usedSalt,
    signingKeypair: {
      publicKey: sodium.to_hex(signingKeypair.publicKey),
      privateKey: sodium.to_hex(signingKeypair.privateKey),
    },
    encryptionKeypair: {
      publicKey: sodium.to_hex(encryptionKeypair.publicKey),
      privateKey: sodium.to_hex(encryptionKeypair.privateKey),
    },
  };
}

export async function signMessage(message, signingPrivateKey) {
  await sodium.ready;

  const signature = sodium.to_hex(sodium.crypto_sign(message, sodium.from_hex(signingPrivateKey)));

  return signature;
}
