
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

  static saveUserInfo(data) {
    const dataObj = JSON.stringify(data);
    localStorage.setItem('userInfo', dataObj);
  }

  static saveUserToken(data) {
    localStorage.setItem('token', data);
  }
}

export default Common;
