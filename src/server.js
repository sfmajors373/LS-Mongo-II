const bodyParser = require('body-parser');
const express = require('express');
const Posts = require('./post');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here

//GET /accepted-answer/:soID
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Posts.findOne({})
    .where('soID')
    .equals(soID)
    .exec((err, posts) => {
      if (err) {
        res.status(STATUS_SERVER_ERROR);
	res.json({ error: err });
      } else {

      }
    });
});

module.exports = { server };
