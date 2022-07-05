import React from 'react';
import { useNavigate } from 'react-router-dom';

import useEffectOnce from '../hooks/useEffectOnce';
import { useUserActionStore, useUserStateStore } from '../store/user/userStore';

function User() {
  const navigate = useNavigate();
  const [isLoggedIn, username, createdAt, isFetchingUser, isPending] = useUserStateStore(store => [
    store.isLoggedIn,
    store.username,
    store.createdAt,
    store.isFetchingUser,
    store.isPending,
  ]);
  const fetchUser = useUserActionStore(store => store.fetchUser);
  const logout = useUserActionStore(store => store.logout);
  const deleteUser = useUserActionStore(store => store.deleteUser);

  useEffectOnce(() => {
    fetchUser();
  });

  if (!isLoggedIn || !createdAt) {
    return null;
  }

  if (isFetchingUser) {
    return 'loading';
  }

  return (
    <>
      <h1>Me</h1>
      {username}
      <br />
      {new Date(createdAt).toString()}
      <br />
      <button onClick={() => logout(navigate)}>Logout</button>
      <br />
      <button disabled={isPending} onClick={() => deleteUser(navigate)}>
        Delete user
      </button>
    </>
  );
}

export default User;
