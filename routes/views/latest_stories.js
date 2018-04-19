const keystone = require("keystone");

exports = module.exports = function(req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	// Init locals.
	locals.section = "latest_stories";
	locals.data = {
		pageNumber: 1,
		maxPageNumber: 1,
		shouldHaveFirst: false,
		shouldHaveLast: false,
		articles: null
	};

	// Load the articles.
	view.on("init", function(next) {
		let q = keystone
			.list("Article")
			.paginate({
				page: ~~(+req.query.page || 1), // ~~ means Math.trunc
				perPage: 10,
				maxPages: 10,
				filters: {
					state: "published"
				}
			})
			.where("slug")
			.sort("-issue")
			.populate("article");

		q.exec(function(err, results) {
			locals.data.articles = results.results;
			locals.data.pageNumber = ~~+req.query.page || 1;
			next(err);
		});
	});

	view.on("init", next => {
		keystone.list("Article").model.count({}, (err, count) => {
			locals.data.maxPageNumber = Math.ceil(count / 10);
			locals.data.shouldHaveFirst = locals.data.pageNumber >= 3;
			locals.data.shouldHaveLast =
				locals.data.pageNumber <= locals.data.maxPageNumber - 2;
			console.log(locals.data);
			next(err);
		});
	});

	// Render the view.
	view.render("latest_stories_standalone");
};
