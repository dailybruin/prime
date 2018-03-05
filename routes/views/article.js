var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals.
	locals.section = 'articles';
	locals.filters = {
		article: req.params.article.toLowerCase(), // Article slug.
		issue: req.params.issue.toLowerCase().replace(/\s+/g, '') // Issue.
	};
	locals.data = {
		article: {},
		articles: [],
		config: {}
	};

	// Load the current article.
	view.on('init', async function (next) {
		// Load global config.
		locals.data.config = await keystone.list('Configuration').model.findOne();
	
		// keystone.list('ArticleIssue').model.findOne({slug: locals.filters.issue}).exec((err, issue) => {
			// if (err) {
			// 	next(err);
			// 	return;
			// }
		keystone.list('Article').model
			.findOne({
				state: 'published',
				issue: locals.filters.issue,
				slug: locals.filters.article
			})
			.populate('article')
			.exec((err, article) => {
				if (!article) res.status(404).send('Article not found.');
				// not performant, but whatevs
				article.hitCount += 1;
				article.save();
				locals.data.article = article;
				next(err);
			});
		// });
	});

	// Load other articles.
	view.on('init', function (next) {
		var q = keystone.list('Article').model
			.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.sort('-hitCount')
			.limit(4);

		q.exec(function (err, results) {
			if(!err) locals.data.articles = results;
			next(err);
		});
	});

	// Render the view.
	keystone.list('Article').model
	.findOne({
		state: 'published',
		issue: locals.filters.issue,
		slug: locals.filters.article
	}).exec((err, article) => {
		if (!article) {
			res.status(404).send('Article not found.');
			return;
		}
		view.render(article.template? article.template : 'article');
	});
};
