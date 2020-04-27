(function (global) {
  'use strict;';

  // Class ------------------------------------------------
  const config = {};

  // 이미지 파일을 올리는 파일위치 및 로딩을 위한 변수
  config.tmp = '/home/inflai/tmp/';
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
  config.fb_client_id = '663450957780119';
  config.fb_client_secret = '598b25dd21a5480ad10012b4f9d51bb0';


  // Exports ----------------------------------------------
  module.exports = config;
}((this || 0).self || global));
