var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({dest:'./public/uploads'});

const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/show/:id', function(req, res, next) {
	let posts = db.get('posts');
	posts.findOne({_id: new mongo.ObjectId(req.params.id)},{},(err, post)=>{
		res.render('show',{
			'title': post.title+' | Node Blog',
			'post': post
		});	
	});
});

router.get('/add', function(req, res, next) {
	let categories = db.get('categories');
	categories.find({},{},(err, categories)=>{
		res.render('addpost',{
			title: 'Add Post | Node Blog',
			categories: categories
		});
	});
});
// Add Posts
router.post('/add', upload.single('mainImage'), function(req, res, next) {
	// Get form Values
	let title = req.body.title;
	let category = req.body.category;
	let body = req.body.body;
	let author = req.body.author;
	let date = new Date();
	let mainImage = 'noimage.jpg';
	let ext = "";
	if(req.file){
		ext = req.file.mimetype.split('/')[1];
		mainImage = req.file.filename;
	}
	// Form Validation
	// req.checkBody('title','Title Field is Required').notEmpty();
	let errors = req.validationErrors();
	if(errors){
		res.render('addpost',{
			title: 'Add Post | Node Blog',
			errors: errors
		});
	}else{
		let posts = db.get('posts');
		posts.insert({
			"title": title,
			"body": body,
			"catagory": category,
			"author": author,
			"date": date,
			"mainImage": mainImage,
			"ext": ext
		},(err, post)=>{
			if(err){
				res.send(err);
			}
			else{
				req.flash('success','Post Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
