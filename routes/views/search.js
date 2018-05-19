var keystone = require("keystone");

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	console.log(req.query.query);

	//insert the search api here and process req.query.query
	var searchItem = req.query.query;

	locals.section = "search_articles";
	// locals.filters = {
	// 	articleSlug: //insert slug from search_api here
	// };
	// locals.data = {
	// 	searchArticle = {},
	// 	searchArticles: []
	// };

	// Load the current article.
	view.on("init", async function(next) {
		// Load global config.
		locals.data.config = await keystone.list("Configuration").model.findOne();

		keystone
			.list("Article")
			.model.findOne({
				state: "published",
				slug: locals.filters.articleSlug
			})
			.populate("article")
			.exec((err, article) => {
				if (!article) res.status(404).send("Article not found.");
				locals.data.article = searchArticle;
				next(err);
			});
		// });
	});

	// Load other articles.
	view.on("init", function(next) {
		var q = keystone
			.list("Article")
			.model.find()
			.where("state", "published");

		q.exec(function(err, results) {
			if (!err) locals.data.searchArticles = results;
			next(err);
		});
	});

	// Render the view.
	view.render("search");
};
