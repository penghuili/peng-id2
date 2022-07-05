import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserActionStore, useUserStateStore } from '../store/user/userStore';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isPending, error] = useUserStateStore(store => [store.isPending, store.error]);
  const signup = useUserActionStore(store => store.signup);

  return (
    <>
      <h1>Signup</h1>
      <label>Username: </label>
      <input value={username} onChange={e => setUsername(e.target.value)} autoFocus />
      <br />
      <label>Password: </label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <button disabled={isPending} onClick={() => signup(username, password, navigate)}>
        Signup
      </button>
      <br />
      <p>{error}</p>
    </>
  );
}

export default Signup;
