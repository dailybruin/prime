let db = require("../db.js");
let fetch = require("node-fetch");
let sortByIssueReversed = require("../utils.js").sortByIssueReversed;

module.exports = async function(req, res, next) {
	// Init res.locals.
	res.locals.section = "latest_stories";
	res.locals.data = {
		pageNumber: 1,
		maxPageNumber: 1,
		shouldHaveFirst: false,
		shouldHaveLast: false,
		articles: null
	};
	res.locals.data.pageNumber = ~~(+req.query.page || 1);

	let articles = [];
	try {
		// If a search param was provided, search Kerchoff for the articles. Otherwise just provide all stories.
		if (req.query.q) {
			let query = "q=" + req.query.q + "&page=" + res.locals.data.pageNumber;
			let articles_res = await fetch(
				"https://kerckhoff.dailybruin.com/api/packages/prime/search?" + query
			);
			let articles_data = await articles_res.json();

			let article_slugs = [];
			for (let article of articles_data.data) {
				article_slugs.push(article._source.slug);
			}

			if (req.query.section) {
				articles = await db.Article.find({
					section: req.query.section,
					modelSlug: { $in: article_slugs }
				}).exec();
			} else {
				articles = await db.Article.find({
					modelSlug: { $in: article_slugs }
				}).exec();
			}
		} else {
			articles = await db.Article.find().exec();
		}
	} catch (err) {
		return next(err);
	}
	let count = articles.length;

	articles = articles.map(o => o.toObject());
	let sortedArticles = articles.slice();
	sortedArticles.sort(sortByIssueReversed);
	let startIndex = (res.locals.data.pageNumber - 1) * 10;
	res.locals.data.articles = sortedArticles.slice(startIndex, startIndex + 10);

	res.locals.data.maxPageNumber = Math.ceil(count / 10);
	res.locals.data.shouldHaveFirst = res.locals.data.pageNumber >= 3;
	res.locals.data.shouldHaveLast =
		res.locals.data.pageNumber <= res.locals.data.maxPageNumber - 2;

	// Render the view.
	res.render("all_stories.njk");
};
