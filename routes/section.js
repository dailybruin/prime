let db = require("../db.js");

module.exports = async function(req, res, next) {
	res.locals.data = {
		config: res.locals.config,
		section: req.params.section,
		featured: null,
		mainarticle: null // The "top" article of the section.
	};

	// Load featured articles in this section.
	if (!res.locals.data.config.sections.includes(req.params.section)) {
		return res.status(404).send("Section does not exist.");
	}

	try {
		res.locals.data.featured = await db.Article.find({
			featured: "featured",
			section: req.params.section
		}).exec();

		res.locals.data.mainarticle = await db.Article.findOne({
			section: req.params.section,
			featured: "main feature"
		}).exec();

		// Render the view.
		res.render("section.njk");
	} catch (err) {
		return next(err);
	}
};
