import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [socialType, setSocialType] = useState(null);
  const [userName, setUserName] = useState(null);

  const login = useCallback((jwtToken, role, name, type) => {
    setToken(jwtToken);
    setUserRole(role);
    setUserName(name);
    setSocialType(type);

    localStorage.setItem(storageName, JSON.stringify({
      userRole: role, token: jwtToken, socialType: type, userName: name
    }));
  }, []);


  const logout = useCallback(() => {
    setToken(null);
    setUserRole(null);
    setUserName(null);
    setSocialType(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userRole, data.userName, data.socialType);
    }
    setReady(true);
  }, [login]);


  return {
    login, logout, token, userRole, socialType, userName, ready
  };
};

export default useAuth;
