
class Common {
  static getUserInfo() {
    return (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))
      : {
        token: '',
        name: '',
        social_type: '',
        regState: ''
      });
  }

  static getUserType() {
    return localStorage.getItem('userType') ? localStorage.getItem('userType') : '';
  }

  static getToken() {
    return localStorage.getItem('token') ? localStorage.getItem('token') : '';
  }

  static getIgAccounts() {
    return localStorage.getItem('igAccounts') ? JSON.parse(localStorage.getItem('igAccounts')) : [];
  }

  static saveUserInfo(data) {
    const dataObj = JSON.stringify(data);
    localStorage.setItem('userInfo', dataObj);
  }

  static saveUserToken(data) {
    localStorage.setItem('token', data);
  }

  static saveIgAccounts(data) {
    localStorage.setItem('igAccounts', JSON.stringify(data));
  }
}

export default Common;
