export const LocalStorageKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  expiresAt: 'expiresAt',
  signingPublicKey: 'signingPublicKey',
  signingPrivateKey: 'signingPrivateKey',
  encryptionPublicKey: 'encryptionPublicKey',
  encryptionPrivateKey: 'encryptionPrivateKey',
};

export const LocalStorage = {
  get(key) {
    // For next.js
    if (typeof window === 'undefined') {
      return '';
    }
    return JSON.parse(localStorage.getItem(key));
  },
  set(key, value) {
    if (typeof window === 'undefined') {
      return;
    }

    if (typeof value === 'undefined') {
      localStorage.setItem(key, JSON.stringify(null));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove(key) {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(key);
  },

  reset() {
    LocalStorage.remove(LocalStorageKeys.accessToken);
    LocalStorage.remove(LocalStorageKeys.refreshToken);
    LocalStorage.remove(LocalStorageKeys.expiresAt);
    LocalStorage.remove(LocalStorageKeys.signingPublicKey);
    LocalStorage.remove(LocalStorageKeys.signingPrivateKey);
    LocalStorage.remove(LocalStorageKeys.encryptionPublicKey);
    LocalStorage.remove(LocalStorageKeys.encryptionPrivateKey);
  },
  saveTokens({ accessToken, refreshToken, expiresIn }) {
    LocalStorage.set(LocalStorageKeys.accessToken, accessToken);
    LocalStorage.set(LocalStorageKeys.refreshToken, refreshToken);
    LocalStorage.set(LocalStorageKeys.expiresAt, Date.now() + (expiresIn - 20) * 1000);
  },
  saveKeypairs(signingKeypair, encryptionKeypair) {
    LocalStorage.set(LocalStorageKeys.signingPublicKey, signingKeypair.publicKey);
    LocalStorage.set(LocalStorageKeys.signingPrivateKey, signingKeypair.privateKey);
    LocalStorage.set(LocalStorageKeys.encryptionPublicKey, encryptionKeypair.publicKey);
    LocalStorage.set(LocalStorageKeys.encryptionPrivateKey, encryptionKeypair.privateKey);
  },
};
