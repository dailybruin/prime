var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		config: null,
		featured: null, // Site-wide featured articles as specified in config.
		mainarticle: null, // Main Article as specified in config.
		articles: null // All articles.
	};

	view.on('init', async function(next) {
		// Load global config.
		try {
			locals.data.config = await keystone.list('Configuration').model.findOne();
			
			locals.data.mainarticle = await keystone.list('Article').model
				.findOne({ slug: locals.data.config.mainarticle })
				.populate('article' /*issue'*/);
			
			locals.data.featured = await keystone.list('Article').model
				.find().where('slug').in(locals.data.config.featured)
				.populate('article' /*issue'*/);
			
			locals.data.articles = await keystone.list('Article').model
				.find({
					state: 'published',
					 // Only load articles from the ucrrent issue into the index.
				}).where('slug')
				.nin(locals.data.config.featured + [locals.data.config.mainarticle])
				.sort('-issue')
				.populate('article' /*issue'*/);
		} catch (e) {
			next(e);
		}
		
		next();
	});

	// Render the view
	view.render('index');
};
