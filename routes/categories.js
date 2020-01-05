var express = require('express');
var router = express.Router();

const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function(req, res, next) {
	let posts = db.get('posts');
	posts.find({catagory: req.params.category},{},(err, posts)=>{
		res.render('index',{
			'title': 'Category '+req.params.category+' | Node Blog',
			'posts': posts
		});
	});
});

router.get('/add', function(req, res, next) {
	let categories = db.get('categories');
	categories.find({},{},(err, categories)=>{
		res.render('addcategory',{
			title: 'Add Category | Node Blog',
			categories: categories
		});
	});
});

// Add Category
router.post('/add', function(req, res, next) {
	// Get form Values
	let category = req.body.category;
	
	// Form Validation
	req.checkBody('category','Field cannot be Empty').notEmpty();
	let errors = req.validationErrors();
	if(errors){
		res.render('addcategory',{
			title: 'Add Category | Node Blog',
			errors: errors
		});
	}else{
		let categories = db.get('categories');
		categories.insert({
			"name": category
		},(err, post)=>{
			if(err){
				res.send(err);
			}
			else{
				req.flash('success','Category Added');
				res.location('/');
				res.redirect('/categories/add');
			}
		});
	}
});

module.exports = router;
