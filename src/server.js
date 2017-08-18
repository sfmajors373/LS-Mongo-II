const bodyParser = require('body-parser');
const express = require('express');
const Posts = require('./post');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

// GET /accepted-answer/:soID
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Posts.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      Posts.findOne({ soID: post.acceptedAnswerID })
        .exec((error, answer) => {
          if (!answer) {
            sendUserError(error, res);
            return;
          }
          res.json(answer);
        });
    });
});

//   Posts.findOne({})
//     .where('soID')
//     .equals(soID)
//     .exec((err, posts) => {
//       if (err) {
//         res.status(STATUS_SERVER_ERROR);
//         res.json({ error: err });
//       // } else {
//       }
//     });
// });

module.exports = { server };
