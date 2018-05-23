let db = require("../db.js");
let sortByIssueReversed = require("../utils.js").sortByIssueReversed;

module.exports = async function(req, res, next) {
	// res.locals.section is used to set the currently selected
	// item in the header navigation.
	res.locals.section = "home";
	res.locals.data = {
		config: res.locals.config,
		featured: null, // Site-wide featured articles as specified in config.
		mainarticle: null, // Main Article as specified in config.
		articles: null // All articles.
	};

	try {
		res.locals.data.mainarticle = await db.Article.findOne({
			slug: res.locals.data.config.mainarticle
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
