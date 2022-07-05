import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserActionStore, useUserStateStore } from '../store/user/userStore';

function Signin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, error] = useUserStateStore(store => [store.isPending, store.error]);
  const signin = useUserActionStore(store => store.signin);

  return (
    <>
      <h1>Signin</h1>
      <label>Username: </label>
      <input value={username} onChange={e => setUsername(e.target.value)} autoFocus />
      <br />
      <label>Password: </label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <button disabled={isPending} onClick={() => signin(username, password, navigate)}>
        Signin
      </button>
      <br />
      <p>{error}</p>
    </>
  );
}

export default Signin;
