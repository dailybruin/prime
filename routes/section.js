let db = require("../db.js");

module.exports = async function(req, res, next) {
	res.locals.data = {
		config: res.locals.config,
		section: req.params.section,
		featured: [],
		articles: [],
		mainarticle: null // The "top" article of the section.
	};

	// Load featured articles in this section.
	if (!res.locals.data.config.sections.includes(req.params.section)) {
		return res.status(404).send("Section does not exist.");
	}

	try {
		let articles = await db.Article.find({
			section: req.params.section
		}).exec();

		// Check which articles are featured.
		for (let i = 0; i < articles.length; i++) {
			let slug = articles[i].slug;
			if (res.locals.config.main_features.includes(slug)) {
				res.locals.data.mainarticle = articles[i];
			} else if (res.locals.config.featured.includes(slug)) {
				res.locals.data.featured.push(articles[i]);
			} else {
				res.locals.data.articles.push(articles[i]);
			}
		}

		// Render the view.
		res.render("section.njk");
	} catch (err) {
		return next(err);
	}
};
