let db = require("../db.js");
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

	// SHOULD FETCH ALL AND SORT instead of pagination now
	let articles = [];
	try {
		articles = await db.Article.find().exec();
	} catch (err) {
		return next(err);
	}
	let count = articles.length;

	res.locals.data.pageNumber = ~~(+req.query.page || 1);

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
