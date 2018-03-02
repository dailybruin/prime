var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals.
	locals.section = 'articles';
	locals.filters = {
		article: req.params.article.toLowerCase(), // Article slug.
		issue: req.params.issue.toLowerCase() // Issue slug.
	};
	locals.data = {
		articles: [],
	};

	// Load the current article.
	view.on('init', async function (next) {		
		keystone.list('ArticleIssue').model.findOne({slug: locals.filters.issue}).exec((err, issue) => {
			if (err) {
				next(err);
				return;
			}
			keystone.list('Article').model
			.findOne({
				state: 'published',
				issue: issue._id, // kill me there must be a better way to do this
				slug: locals.filters.article
			})
			.populate('issue')
			.exec((err, article) => {
				locals.data.article = article;
				next(err);
			});
		});
	});

	// Load other articles.
	view.on('init', function (next) {
		var q = keystone.list('Article').model
			.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.articles = results;
			next(err);
		});
	});

	// Render the view.
	view.render('article');
};
