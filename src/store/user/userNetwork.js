import { generateKeypairs, signMessage } from '../../lib/crypto';
import errorCodes from '../../lib/errorCodes';
import HTTP from '../../lib/HTTP';
import { LocalStorage, LocalStorageKeys } from '../../lib/LocalStorage';
import { handleReceivedTokens } from './userHelpers';

let isRefreshingTokens = false;

const userNetwork = {
  async signup({ username, password }, set, navigate) {
    set({ username, isPending: true });

    try {
      const { salt, signingKeypair, encryptionKeypair } = await generateKeypairs(password);

      const { id: userId, twoFactorSecret } = await HTTP.publicPost(`/v1/sign-up`, {
        username,
        salt,
        signingPublicKey: signingKeypair.publicKey,
        encryptionPublicKey: encryptionKeypair.publicKey,
      });

      set({ userId, twoFactorSecret, isPending: false, error: '' });

      LocalStorage.saveKeypairs(signingKeypair, encryptionKeypair);

      navigate('/signup/setup-2fa');
    } catch ({ errorCode }) {
      let message = '';
      switch (errorCode) {
        case errorCodes.USER_EXISTS:
          message = 'This username is used.';
          break;

        default:
          message = 'Something went wrong.';
      }

      set({ error: message, isPending: false });
    }
  },

  async setup2FA({ username, token }, set, navigate) {
    set({ isPending: true });

    try {
      await HTTP.publicPost(`/v1/2fa/setup`, {
        username,
        token,
      });

      set({ twoFactorEnabled: true, isPending: false, error: '' });
      navigate('/signin');
    } catch ({ errorCode }) {
      let message = '';
      switch (errorCode) {
        case errorCodes.USER_NOT_FOUND:
          message = 'User not found.';
          break;

        case errorCodes.INVALID_2FA_TOKEN:
          message = 'Invalid token.';
          break;

        default:
          message = 'Something went wrong.';
      }

      set({ error: message, twoFactorEnabled: false, isPending: false });
    }
  },

  async signin({ username, password }, set, navigate) {
    set({ isPending: true });

    try {
      const { salt, signinChallenge } = await HTTP.publicGet(`/v1/me-public/${username}`);
      set({ salt });

      const { signingKeypair, encryptionKeypair } = await generateKeypairs(password, salt);
      const signature = await signMessage(signinChallenge, signingKeypair.privateKey);

      const data = await HTTP.publicPost(`/v1/sign-in`, {
        username,
        signature,
      });

      LocalStorage.saveKeypairs(signingKeypair, encryptionKeypair);

      const { id, twoFactorSecret, tempToken } = data;

      if (twoFactorSecret) {
        set({
          userId: id,
          username,
          twoFactorSecret,
          error: '',
          twoFactorEnabled: false,
          isLoggedIn: false,
          isPending: false,
        });

        navigate('/signin/setup-2fa');
        return;
      }
      if (tempToken) {
        set({
          userId: id,
          username,
          error: '',
          twoFactorEnabled: true,
          tempToken,
          isLoggedIn: false,
          isPending: false,
        });
        navigate('/signin/2fa');
        return;
      }
    } catch (error) {
      set({ error: 'Wrong username or password.', isLoggedIn: false, isPending: false });
      LocalStorage.reset();
    }
  },

  async verifySignin2FA({ tempToken, twoFactorToken }, set, navigate) {
    set({ isPending: true });

    try {
      const data = await HTTP.publicPost(`/v1/sign-in/2fa`, {
        tempToken,
        twoFactorToken,
      });
      handleReceivedTokens(data, set);
      navigate('/me');
    } catch ({ errorCode, status }) {
      if (status === 401) {
        set({
          error: 'Your session expired, please signin again.',
          isLoggedIn: false,
          isPending: false,
        });
        navigate('/signin');
        return;
      }

      if (errorCode === errorCodes.INVALID_2FA_TOKEN) {
        set({
          error: 'Your 2FA token is not valid anymore, please enter a new one.',
          isLoggedIn: false,
          isPending: false,
        });
        return;
      }
    }
  },

  async refreshTokens(set) {
    if (isRefreshingTokens) {
      return;
    }

    isRefreshingTokens = true;

    const refreshToken = LocalStorage.get(LocalStorageKeys.refreshToken);
    if (!refreshToken) {
      set({ isLoggedIn: false });
      isRefreshingTokens = false;
      return false;
    }

    set({ isPending: true });

    try {
      const data = await HTTP.publicPost(`/v1/sign-in/refresh`, {
        refreshToken,
      });

      handleReceivedTokens(data, set);
    } catch (error) {
      set({ error: 'Invalid refresh token.', isPending: false });
    }

    isRefreshingTokens = false;
  },

  async fetchUser(set, get) {
    if (get().isFetchingUser) {
      return;
    }

    set({ isFetchingUser: true });

    try {
      const { id, username, twoFactorSecret, createdAt } = await HTTP.get(`/v1/me`);
      set({ userId: id, username, twoFactorSecret, createdAt, isFetchingUser: false });
    } catch (error) {
      set({ error, isFetchingUser: false });
    }
  },

  async logout(set, navigate) {
    LocalStorage.reset();

    set({
      userId: '',
      username: '',
      salt: '',
      twoFactorSecret: null,
      twoFactorEnabled: false,
      createdAt: '',
      isLoggedIn: false,
      isPending: false,
      isFetchingUser: false,
      error: '',
    });

    navigate('/signin');
  },

  async deleteUser(set, navigate) {
    set({ isPending: true });

    try {
      await HTTP.delete(`/v1/me`);
      userNetwork.logout(set, navigate);
    } catch (error) {
      set({ error: 'Detetion failed.', isPending: false });
    }
  },
};

export default userNetwork;
