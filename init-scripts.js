var fm = require('front-matter');
var cm = require('commonmark');
var marked = require('marked');
var fetch = require('node-fetch');
var Article;

function createArticle(articlejson, endpoint, currentissue) {
	let article = new Article.model();

	let articledata = fm(articlejson.cached_article_preview);
	let metadata = articledata.attributes;
	let markdown = articledata.body;
	
	let renderer = new marked.Renderer();
	renderer.image = (href, title, text) => {
	  let info = text.split('|');
	  return `<div class="article__inlineimg ${info[1]}">
	  <img src="${href}" />
	  <div class="article__block-imgbox-photo-credit-wrapper">
		 <div class="article__block-imgbox-photo-credit-name">${
		   info[0]
		 }</div>
		 <div class="article__block-imgbox-photo-credit-title">/ daily bruin</div>
	  </div>
	 </div>`;
	};

	// Parse article markdown.
	article.content.body.html = marked(markdown, { renderer: renderer });
	//(new cm.HtmlRenderer()).render((new cm.Parser()).parse(markdown));
	article.content.body.md = markdown;

	// Set metadata.
	article.modelSlug = articlejson.slug;
	article.endpoint = endpoint;
	article.content.excerpt = metadata.excerpt;
	article.author = metadata.author;
	article.section = metadata.category.toLowerCase();
	article.cover.imgurl = metadata.cover? articlejson.images.s3[metadata.cover.img].url : "";
	article.cover.author = metadata.cover? metadata.cover.author : "";
	article.title = metadata.title;
	article.prettyIssue = metadata.issue;
	article.issue = metadata.issue.toLowerCase().replace(/\s+/g, '');
	article.state = 'published';
	article.template = metadata.template? metadata.template.toLowerCase() : "article"; // "article" is default template.
	article.gallery = metadata.gallery? (metadata.gallery.map(image => articlejson.images.s3[image].url)) : [];

	if (article.issue == currentissue) {
		article.featured = 'featured';
	} else {
		article.featured = 'no';
	}

	article.save(function (err) {
		if (err) {
			console.error('Error saving article ' + article.title + ' to the database.');
			console.error(err);
			return;
		}

		// Need to save the path as well. Note that article.slug is automatically generated when the article is saved by keystone.
		article.path = article.issue + '/' + article.slug;
		article.save(err => {
			if (err) {
				console.error('Error saving article ' + article.title + ' to the database.');
				console.error(err);
			} else {
				console.log('Added article ' + article.title + ' to the database.');
			}
		});
	});
}

let loadArticles = function(keystone) {
	Article = keystone.list('Article');
	Config = keystone.list('Configuration');
	Config.model.findOne().exec().then(config => {
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
							let link = 'https://kerckhoff.dailybruin.com' + endpoint.endpoint;
							fetch(link).then(response => {
								response.json().then(articlejson => {
									try {
										createArticle(articlejson, link, config? config.issue : "");
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
	});
}

module.exports = loadArticles;
