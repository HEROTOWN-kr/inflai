(function (global) {
  'use strict;';

  // Class ------------------------------------------------
  const config = {};

  // 이미지 파일을 올리는 파일위치 및 로딩을 위한 변수
  // config.tmp = '/home/inflai/tmp/';
  config.tmp = '/Users/andriantsoy/Desktop/Projects/image/inflai/tmp/';
  config.uploadDir = '/home/inflai/upload/images/';
  config.imgRoot = '/images';
  config.attachRoot = '/home/inflai/upload/attach/';
  config.downDir = '/home/inflai/upload';
  // 비밀번호 암호화
  config.enc_type = 'sha256';
  config.enc_key = 'vr_fetus_hash password';
  config.enc_out_type = 'hex';

  // 푸시 메시지 운영환경 구성
  config.fcm_api_key = 'AAAAYCBYaZA:APA91bGIOYerhJ6xVTIOa-7xOrJQsVOHNyM12m1m0T-aUef9R0GZYafADItf5ETzxKlqeIngL9GLMLcCK3Nhn4YS2pkl4Eug01A64pbzik7TDaf0uZYaVyFAJiIWNnZ0q8iyUHeuNpT5';

  // access keys
  // config.fb_client_id = '663450957780119';
  // config.fb_client_secret = '598b25dd21a5480ad10012b4f9d51bb0';
  // config.fb_client_id = '139193384125564';
  // config.fb_client_secret = '085e5020f9b2cdac9357bf7301f31e01';
  config.fb_client_id = '516055359803896';
  config.fb_client_secret = '613fb68f0f4c96222b61aac98023b62b';

  config.google_client_id = '997274422725-gb40o5tv579csr09ch7q8an63tfmjgfo.apps.googleusercontent.com';
  config.google_client_secret = 'HuxvpMOAlyMa_yZPR7j4FpFg';
  // config.google_client_redirect_url = 'http://localhost:8080/TB_ADVERTISER/Googletest1';

  config.google_client_redirect_url = 'http://localhost:3000';
  // config.google_client_redirect_url = 'https://www.inflai.com';

  config.google_api_key = 'AIzaSyArMk2Jue1FRfkT29_vVZ4qhLBvQpbJaOQ';

  // Exports ----------------------------------------------
  module.exports = config;
}((this || 0).self || global));
