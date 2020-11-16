import { createContext } from 'react';

function noop() {}

const AuthContext = createContext({
  token: null,
  login: noop,
  logout: noop,
  userRole: null,
  userName: null,
  socialType: null,
  isAuthenticated: false
});

export default AuthContext;
