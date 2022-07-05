import React from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Setup2FA from './views/Setup2FA';
import Signin from './views/Signin';
import Signup from './views/Signup';
import User from './views/User';
import Verify2FA from './views/Verify2FA';

function AppRoutes() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/signup">Signup</Link> | <Link to="/signin">Signin</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/signup/setup-2fa" element={<PublicRoute />}>
          <Route path="/signup/setup-2fa" element={<Setup2FA />} />
        </Route>
        <Route path="/signin" element={<PublicRoute />}>
          <Route path="/signin" element={<Signin />} />
        </Route>
        <Route path="/signin/setup-2fa" element={<PublicRoute />}>
          <Route path="/signin/setup-2fa" element={<Setup2FA />} />
        </Route>
        <Route path="/signin/2fa" element={<PublicRoute />}>
          <Route path="/signin/2fa" element={<Verify2FA />} />
        </Route>

        <Route path="/me" element={<ProtectedRoute />}>
          <Route path="/me" element={<User />} />
        </Route>

        <Route path="/" element={<Navigate to="/me" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
