import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useEffectOnce from '../hooks/useEffectOnce';
import { useUserActionStore, useUserStateStore } from '../store/user/userStore';

function ProtectedRoute() {
  const location = useLocation();
  const isLoggedIn = useUserStateStore(store => store.isLoggedIn);
  const refreshTokens = useUserActionStore(store => store.refreshTokens);

  useEffectOnce(() => {
    if (isLoggedIn === undefined) {
      refreshTokens();
    }
  });

  if (isLoggedIn === undefined) {
    return 'loading';
  }

  return isLoggedIn ? <Outlet /> : <Navigate to={`/signin`} replace state={{ location }} />;
}

export default ProtectedRoute;
