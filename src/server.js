const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post');

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
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      Post.findOne({ soID: post.acceptedAnswerID })
        .exec((error, answer) => {
          if (!answer) {
            sendUserError(error, res);
            return;
          }
          res.json(answer);
        });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
      } else {
        const soIDv = soID;
        const acceptedID = post.acceptedAnswerID;
        Post.find({ parentID: { $eq: soID } })
        .sort({ score: -1 })
        .exec((errs, answers) => {
          if (!answers) {
            sendUserError(errs, res);
            return;
          }
          for (let i = 0; i < answers.length; i++) {
            if (answers[i].soID !== acceptedID) {
              res.json(answers[i]);
            }
          }
          sendUserError(err, res);
        });
      }
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ $and: [{ tags: { $in: ['jquery'] } },
            { $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] }] })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
      } else {
        res.json(post);
      }
    });
});

server.get('/npm-answers', (req, res) => {
  const tagged = [];
  Post.find({ tags: { $in: ['npm'] } })
  .exec((err, post) => {
    if (!post) {
      sendUserError(err, res);
      return;
    }
    // ids into array, iterate over array of ids and search whole db for posts w/ matching parentIDs
    post.forEach((p) => {
      tagged.push(p.soID);
    });
  Post.find({ $or: [{ parentID: { $eq: tagged[0] } }, { parentID: { $eq: tagged[1] } }] })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
      } else {
        res.json(post);
      }
    });
  });
//     const answers = [];
//     tagged.forEach((id) => {
//       Post.find({ parentID: id })
//       .exec((err44, apost) => {
//         console.log('CALLEDEEDDD!!!!?');
//         console.log(apost);
//         answers.push(apost);
//       });
//     });
//     console.log(answers);
//     res.json(answers);
//   });
});

module.exports = { server };

