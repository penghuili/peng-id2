import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import { useUserActionStore, useUserStateStore } from '../store/user/userStore';

function Setup2FA() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [twoFactorSecret, twoFactorEnabled, username, error] = useUserStateStore(store => [
    store.twoFactorSecret,
    store.twoFactorEnabled,
    store.username,
    store.error,
  ]);
  const setup2FA = useUserActionStore(store => store.setup2FA);

  if (!twoFactorSecret || twoFactorEnabled) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <h1>Setup 2FA</h1>
      <QRCodeSVG value={twoFactorSecret.uri} />
      <p>Manual setup: {twoFactorSecret.secret}</p>
      <input value={token} onChange={e => setToken(e.target.value)} />
      <br />
      <button onClick={() => setup2FA(username, token, navigate)}>Setup 2FA</button>
      <p>{error}</p>
    </>
  );
}

export default Setup2FA;
