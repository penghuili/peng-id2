import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserActionStore, useUserStateStore } from '../store/user/userStore';

function Verify2FA() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [error] = useUserStateStore(store => [store.error]);
  const verifySignin2FA = useUserActionStore(store => store.verifySignin2FA);

  return (
    <>
      <h1>Verify 2FA</h1>
      <input value={token} onChange={e => setToken(e.target.value)} autoFocus />
      <br />
      <button onClick={() => verifySignin2FA(token, navigate)}>Verify</button>
      <p>{error}</p>
    </>
  );
}

export default Verify2FA;
