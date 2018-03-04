var fm = require('front-matter');
var cm = require('commonmark');
var fetch = require('node-fetch');
var Article;

function createArticle(articlejson) {
	let article = new Article.model();

	let articledata = fm(articlejson.cached_article_preview);
	let metadata = articledata.attributes;
	let markdown = articledata.body;
	
	// Parse article markdown.
	article.content.body.html = (new cm.HtmlRenderer()).render((new cm.Parser()).parse(markdown)); 
	article.content.body.md = markdown;

	// Set metadata.
	article.modelSlug = articlejson.slug;
	article.content.excerpt = metadata.excerpt;
	article.author = metadata.author;
	article.section = metadata.category.toLowerCase();
	article.cover.imgurl = metadata.cover? articlejson.images.s3[metadata.cover.img].url : "";
	article.cover.author = metadata.cover? metadata.cover.author : "";
	article.title = metadata.title;
	article.issue = metadata.issue;
	article.state = 'published';

	article.save(function (err) {
		if (err) {
			console.error('Error saving article ' + article.title + ' to the database.');
			console.error(err);
		} else {
			console.log('Added article ' + article.title + ' to the database.');
		}
	});
}

let loadArticles = function(keystone) {
	Article = keystone.list('Article');
	//Fetch each individual article and load into database.
	fetch('https://kerckhoff.dailybruin.com/api/packages/prime?endpoints=true').then(endpointsresponse => {
		endpointsresponse.json().then(endpoints => {
			endpoints.data.forEach(endpoint => {
				Article.model.find({
					modelSlug: endpoint.slug,
				})
				.exec()
				.then((res) => {
					if (res.length !== 0) {
						console.log(res[0].modelSlug + " exists! Skipping.")
					} else {
						fetch('https://kerckhoff.dailybruin.com' + endpoint.endpoint).then(response => {
							response.json().then(articlejson => {
								try {
									createArticle(articlejson);
								} catch (err) {
									console.error('Error saving article ' + endpoint.slug + ' to the database.');
									console.error(err);
									//done(err);
								}
							});
						}).catch(err => {
							console.error('Error saving article ' + endpoint.slug + ' to the database.');
							console.error(err);
							//done(err);
						});
					}
				});
			});
		});
		//done();
	}).catch(err => {
		console.error('Error retrieving list of endpoints from https://kerckhoff.dailybruin.com/api/packages/prime?endpoints=true');
		//done(err);
	});
}

module.exports = loadArticles;
