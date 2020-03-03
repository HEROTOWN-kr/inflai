const express = require('express');
const Member = require('../models').TB_MEMBER;
const common = require('../config/common');

const router = express.Router();

router.get('/userName', (req, res) => {
  const data = req.query;
  const { token } = data;

  const decoded = common.getIdFromToken(token);


  Member.findOne({
    where: { MEM_ID: decoded.sub }
  }).then((user) => {
    if (user) {
      return res.json({
        code: 200,
        data: user.dataValues
      });
    }
  });
});

router.get('/:id', (req, res) => {
  console.log('getting one book');
  /* Message.findById(req.params.id).then(result => {
          console.log(result);
          res.json(result);
      }); */

  Message.findOne({ where: { MSG_ID: req.params.id } }).then((result) => {
    console.log(result);
    res.json(result);
  }).error((err) => {
    res.send('error has occured');
  });
});

router.post('/', (req, res) => {
  Message.create({
    MSG_SENDER: req.body.sender,
    MSG_RECEIVER: req.body.receiver,
    MSG_MESSAGE: req.body.message
  }).then((message) => {
    console.log(message.get({
      plain: true
    }));
    res.send(message);
  });
});

/* router.put('/:id', function(req, res){
    Book.update({
        title: req.body.title,
        author: req.body.author,
        category: req.body.category
    },{
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

router.delete('/:id', function(req, res){
    Book.destroy({
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
}); */

module.exports = router;
