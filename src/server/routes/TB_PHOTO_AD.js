const express = require('express');

const router = express.Router();
const async = require('async');
const uniqid = require('uniqid');
const fse = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const Photo = require('../models').TB_PHOTO_AD;
const config = require('../config/config');
const { resizeImage } = require('../config/common');
// 이미지 업로드

router.post('/uploadImage', async (req, res, next) => {
  try {
    const { file } = req.files;
    const { id } = req.body;
    const uid = uniqid();

    const currentPath = file.path;
    const fileExtension = path.extname(file.name);
    const fileName = `${uid}_400_316${fileExtension}`;
    const tmpPath = path.normalize(`${config.tmp}${fileName}`);
    const uploadPath = path.normalize(`${config.attachRoot}/campaign/${id}/${fileName}`);

    await resizeImage(currentPath, tmpPath, 400, 316);
    await fse.move(tmpPath, uploadPath, { clobber: true });
    await fse.remove(currentPath);

    const DRAWING_URL = `/attach/campaign/${id}/${fileName}`;

    const post = {
      AD_ID: id,
      PHO_FILE: DRAWING_URL
    };

    await Photo.create(post);

    return res.status(200).send({ uploaded: true });
  } catch (err) {
    return res.status(400).json({ uploaded: false, error: { message: err.message } });
  }
});

router.post('/upload', (req, res, next) => {
  const { file } = req.files;
  const { id } = req.body;
  const colName = req.body;
  const idx = req.body;
  const uid = uniqid();


  const newFileNm = path.normalize(uid + path.extname(file.name));
  const uploadPath = path.normalize(`${config.attachRoot}/portfolio/${id}/`) + newFileNm;
  const post = {
    AD_ID: id
  };

  /* post.PRF_FILE_NM = file.name;
  post.PRF_FILE_MT = mime.contentType(file.name); */


  async.waterfall([
    function (done) { // 파일 tmp -> 폴더로 이동
      fse.move(file.path, uploadPath, { clobber: true }, (err) => {
        done(err, newFileNm);
      });
    },
    function (newFileNm, done) { //
      console.log('test');
      const DRAWING_URL = `${'/attach' + '/portfolio/'}${id}/${newFileNm}`;
      post.PHO_FILE = DRAWING_URL;

      Photo.create(post).then((result) => {
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
router.post('/delete', async (req, res, next) => {
  try {
    const data = req.body;
    const { id } = data;

    const PhotoInfo = await Photo.findOne({
      where: { PHO_ID: id },
      attributes: ['PHO_FILE']
    });

    const { PHO_FILE } = PhotoInfo;
    const deletePath = path.normalize(`${config.downDir}${PHO_FILE}`);
    await fse.remove(deletePath);

    Photo.destroy({ where: { PHO_ID: id } });
    res.status(200).json({ message: 'success' });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
