const fs = require('fs');
const Posts = require('./post');
const mongoose = require('mongoose');
const posts = require('../posts.json');

let savedPosts = null;

// mongoose.Promise = global.Promise;
// mongoose.connect(
//   'mongodb://localhost/posts',
//   { useMongoClient: true }
// );

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

// const populate = () => {
const populatePosts = () => {
  // TODO: implement this
  readPosts();
  const promises = savedPosts.map(p => new Posts(p).save());
  return Promise.all(promises);
};
  // return populate()
  //   .then(() => {
  //     console.log('done');
  //     mongoose.disconnect();
  //   })
  //   .catch((err) => {
  //     console.log('ERROR', err);
  //     throw new Error(err);
  //   });
// };
populatePosts().then((allPosts) => {
  return allPosts;
});
module.exports = { readPosts, populatePosts };
