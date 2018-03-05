
var keystone = require('keystone');
var async = require('async');
var User = keystone.list('User');
var Article = keystone.list('Article');
var Configuration = keystone.list('Configuration');

var fm = require('front-matter');
var cm = require('commonmark');
var fetch = require('node-fetch');

let admins = [
	{ 'name.first': 'Admin', 'name.last': 'User', 'email': 'admin@dailybruin.com', 'password': 'admin', 'isAdmin': true },	
];
let config = [
	{ 'issue': 'Winter18', 'sections': ["arts", "culture", "lifestyle"], 'mainarticle': 'on_your_mark', 'featured': []}
];

function createAdmin (admin, done) {
	var newAdmin = new User.model(admin);

	newAdmin.isAdmin = true;
	newAdmin.save(function (err) {
		if (err) {
			console.error('Error adding admin ' + admin.email + ' to the database:');
			console.error(err);
		} else {
			console.log('Added admin ' + admin.email + ' to the database.');
		}
		//done(err);
	});
}

function createConfig(config, done) {
	let newConfig = new Configuration.model(config);

	newConfig.save(function (err) {
		if (err) {
			console.error('Error adding configuration options to the database.');
			console.error(err);
		} else {
			console.log('Added configuration options to the database.');
		}
		//done(err);
	})
}

function createArticle(articlejson, done) {
	let article = new Article.model();

	let articledata = fm(articlejson.cached_article_preview);
	let metadata = articledata.attributes;
	let markdown = articledata.body;
	
	// Parse article markdown.
	article.content.body.html = (new cm.HtmlRenderer()).render((new cm.Parser()).parse(markdown)); 
	article.content.body.md = markdown;

	// Set metadata.
	article.content.excerpt = metadata.excerpt;
	article.author = metadata.author;
	article.section = metadata.category.toLowerCase();
	article.cover.imgurl = metadata.cover? metadata.cover.img : "";
	article.cover.author = metadata.cover? metadata.cover.author : "";
	article.title = metadata.title;
	article.issue = metadata.issue;
	article.state = 'published';

	article.save(function (err) {
		if (err) {
			console.error('Error saving article ' + article.title + ' to the database.');
			//console.error(err);
		} else {
			console.log('Added article ' + article.title + ' to the database.');
		}
	});
}

exports = module.exports = function (done) {
	async.forEach(admins, createAdmin, done);
	async.forEach(config, createConfig, done);
	//Fetch each individual article and load into database.
	fetch('https://kerckhoff.dailybruin.com/api/packages/prime?endpoints=true').then(endpointsresponse => {
		endpointsresponse.json().then(endpoints => {
			endpoints.data.forEach(endpoint => {
				fetch('https://kerckhoff.dailybruin.com' + endpoint.endpoint).then(response => {
					response.json().then(articlejson => {
						try {
							createArticle(articlejson, done);
						} catch (err) {
							console.error('Error saving article ' + endpoint.slug + ' to the database.');
							//console.error(err);
							//done(err);
						}
					});
				}).catch(err => {
					console.error('Error saving article ' + endpoint.slug + ' to the database.');
					//console.error(err);
					//done(err);
				});
			});
		});
		done();
	}).catch(err => {
		console.error('Error retrieving list of endpoints from https://kerckhoff.dailybruin.com/api/packages/prime?endpoints=true');
		//done(err);
	});
};
