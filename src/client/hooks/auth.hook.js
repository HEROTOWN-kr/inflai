import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [socialType, setSocialType] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const login = useCallback((jwtToken, role, name, type, photo) => {
    setToken(jwtToken);
    setUserRole(role);
    setUserName(name);
    setUserPhoto(photo);
    setSocialType(type);

    localStorage.setItem(storageName, JSON.stringify({
      userRole: role, token: jwtToken, socialType: type, userName: name, userPhoto: photo
    }));
  }, []);


  const logout = useCallback(() => {
    setToken(null);
    setUserRole(null);
    setUserName(null);
    setSocialType(null);
    localStorage.removeItem(storageName);
  }, []);

  const userDataUpdate = useCallback((name, photo) => {
    setUserName(name);
    setUserPhoto(photo);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userRole, data.userName, data.socialType, data.userPhoto);
    }
    setReady(true);
  }, [login]);


  return {
    login, logout, userDataUpdate, token, userRole, userPhoto, socialType, userName, ready
  };
};

export default useAuth;
