var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  let db = req.db;
  let posts = db.get('posts');
  posts.find({},{},(err, posts)=>{
    res.render('index', {title: "Node Blog", posts: posts });
  });
});

router.get('/about', function(req, res, next) {
    res.render('about', {title: "About | Node Blog"});
});

module.exports = router;
