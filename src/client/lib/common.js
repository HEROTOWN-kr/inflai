
class Common {
  static getUserInfo() {
    return (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))
      : {
        token: '',
        name: ''
      });
  }

  static getUserType() {
    return localStorage.getItem('userType') ? localStorage.getItem('userType') : '';
  }

  static saveUserInfo(data) {
    const dataObj = JSON.stringify(data);
    localStorage.setItem('userInfo', dataObj);
  }
}

export default Common;
