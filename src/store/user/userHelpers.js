import { LocalStorage } from '../../lib/LocalStorage';

export function handleReceivedTokens({ id, accessToken, refreshToken, expiresIn }, set) {
  LocalStorage.saveTokens({ accessToken, refreshToken, expiresIn });

  set({
    userId: id,
    twoFactorSecret: null,
    twoFactorEnabled: true,
    tempToken: '',
    error: '',
    isLoggedIn: true,
    isPending: false,
  });
}
