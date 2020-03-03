const Portfolio = require('../models').TB_PORTFOLIO;
const express = require('express');

const router = express.Router();
const async = require('async');
const uniqid = require('uniqid');
const fse = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const config = require('../config/config');


// 이미지 압로드

// 이미지 업로드
router.post('/upload', (req, res, next) => {
  const  file  = req.files.file;
  const  id  = req.body.id;
  const  colName  = req.body;
  const  idx  = req.body;
  const uid = uniqid();


  const newFileNm = path.normalize(uid + path.extname(file.name));
  const uploadPath = path.normalize(`${config.attachRoot}/portfolio/${id}/`) + newFileNm;
  const post = {
    MEM_ID: id
  };

  post.PRF_FILE_NM = file.name;
  post.PRF_FILE_MT = mime.contentType(file.name);


  async.waterfall([
    function (done) { // 파일 tmp -> 폴더로 이동
      fse.move(file.path, uploadPath, { clobber: true }, (err) => {
        done(err, newFileNm);
      });
    },
    function (newFileNm, done) { //
      const DRAWING_URL = `${'/attach' + '/portfolio/'}${id}/${newFileNm}`;
      post.PRF_FILE = DRAWING_URL;

      Portfolio.create(post).then((result) => {
        done(null, result);
      }).catch((err) => {
        done(err, null);
      });
    }
  ],
  (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ code: 500, message: '이미지 업로드시 에러가 발생하였습니다.', data: err });
    }
    return res.json({ code: 200, message: '', data: '' });
  });
});

// 삭제
router.post('/delete', (req, res, next) => {
  const data = req.body;
  const PRF_ID = data.id;

  async.waterfall([
    function (done) {
      db.exec('DELETE FROM ?? WHERE PRF_ID = ?', [table_name, PRF_ID], (err, result) => {
        if (err) {
          return done(err);
        }

        done(null, result.changedRows);
      });
    }],
  (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ result: err });
    }
    res.json(data);
  });
});

module.exports = router;
