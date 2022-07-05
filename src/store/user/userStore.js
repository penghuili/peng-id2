import create from 'zustand';
import shallow from 'zustand/shallow';

import userNetwork from './userNetwork';

const userStore = create((set, get) => ({
  userId: '',
  username: '',
  salt: '',
  twoFactorSecret: null,
  twoFactorEnabled: false,
  tempToken: '',
  createdAt: '',
  isLoggedIn: undefined,
  isPending: false,
  isFetchingUser: false,
  error: '',

  signup: (username, password, navigate) =>
    userNetwork.signup({ username, password }, set, navigate),

  setup2FA: (username, token, navigate) => userNetwork.setup2FA({ username, token }, set, navigate),

  signin: (username, password, navigate) =>
    userNetwork.signin({ username, password }, set, navigate),

  verifySignin2FA: (twoFactorToken, navigate) => {
    const tempToken = get().tempToken;
    return userNetwork.verifySignin2FA({ tempToken, twoFactorToken }, set, navigate);
  },

  refreshTokens: () => userNetwork.refreshTokens(set),

  logout: navigate => userNetwork.logout(set, navigate),

  fetchUser: () => userNetwork.fetchUser(set, get),

  deleteUser: navigate => userNetwork.deleteUser(set, navigate),
}));

export const useUserActionStore = selector => userStore(selector);
export const useUserStateStore = selector => userStore(selector, shallow);
