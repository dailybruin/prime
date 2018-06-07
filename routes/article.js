let db = require("../db.js");

module.exports = async function(req, res, next) {
	// Set locals.
	res.locals.section = "articles";
	res.locals.data = {
		article: {},
		articles: [],
		config: {}
	};

	try {
		let article = await db.Article.findOne({
			state: "published",
			issue: req.params.issue.toLowerCase().replace(/\s+/g, ""),
			slug: req.params.article.toLowerCase()
		}).exec();

		if (!article) {
			return res.status(404).send("Article not found.");
		}
		article.hitCount += 1;
		article.save(); // TODO: Not sure if this is saving.
		res.locals.data.article = article;

		// Load other articles.
		res.locals.data.articles = await db.Article.find({ state: "published" })
			.sort({ publishedDate: -1, hitCount: -1 })
			.limit(4)
			.exec();

		// Render the view, based on the type of template used by the article.
		article.template = article.template ? article.template : "article";
		return res.render(article.template + ".njk");
	} catch (err) {
		return next(err);
	}
};
