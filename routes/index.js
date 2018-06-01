let db = require("../db.js");
let sortByIssueReversed = require("../utils.js").sortByIssueReversed;

module.exports = async function(req, res, next) {
	// res.locals.section is used to set the currently selected
	// item in the header navigation.
	res.locals.section = "home";
	res.locals.data = {
		config: res.locals.config,
		featured: null, // Site-wide featured articles as specified by main_featured in config.
		mainarticle: null, // Main Article as specified by mainarticle in config.
		articles: null // All articles.
	};

	try {
		// Kinda inefficient (since we're doing three db calls when we could be doing one), but works for now.
		res.locals.data.mainarticle = await db.Article.findOne({
			slug: res.locals.data.config.mainarticle
		}).exec();

		res.locals.data.featured = await db.Article.find({
			slug: res.locals.data.config.main_features
		}).exec();

		let allResults = await db.Article.find({
			state: "published",
			slug: {
				$nin: res.locals.data.config.featured.concat([
					res.locals.data.config.mainarticle
				])
			}
		}).exec();

		allResults = allResults.map(o => o.toObject());
		let sortedResults = allResults.slice();
		sortedResults.sort(sortByIssueReversed);
		res.locals.data.articles = sortedResults.slice(0, 5);

		// Render the view
		return res.render("index.njk");
	} catch (err) {
		return next(err);
	}
};
