const keystone = require("keystone");

const seasonEnum = {
	fall: 3,
	spring: 2,
	winter: 1
};

const sortByIssue = (a, b) => {
	let aIssue = a.prettyIssue || a.issue || "";
	let bIssue = b.prettyIssue || b.issue || "";

	let aArr = aIssue.split(" ").map(e => e.trim());
	let bArr = bIssue.split(" ").map(e => e.trim());

	if (aArr.length < 2 || bArr.length < 2) {
		return 0; // bad result
	}
	aArr[0] = aArr[0].toString().toLowerCase();
	aArr[1] = +aArr[1] || 0;
	bArr[0] = bArr[0].toString().toLowerCase();
	bArr[1] = +bArr[1] || 0;

	if (aArr[1] > bArr[1]) {
		return 1;
	} else if (aArr[1] < bArr[1]) {
		return -1;
	} else {
		if (!(aArr[0] in seasonEnum) || !(bArr[0] in seasonEnum)) {
			return 1;
		} else {
			if (seasonEnum[aArr[0]] > seasonEnum[bArr[0]]) {
				return 1;
			} else if (seasonEnum[aArr[0]] < seasonEnum[bArr[0]]) {
				return -1;
			} else {
				return 0;
			}
		}
	}
};

const sortByIssueReversed = (a, b) => sortByIssue(b, a);

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
	view.on("init", next => {
		locals.data.pageNumber = ~~(+req.query.page || 1);
		// SHOULD FETCH ALL AND SORT instead of pagination now
		keystone
			.list("Article")
			.model.find({})
			.exec((err, results) => {
				results = results.map(o => o.toObject());
				let sortedResults = results.slice();
				sortedResults.sort(sortByIssueReversed);
				let startIndex = (locals.data.pageNumber - 1) * 10;
				locals.data.articles = sortedResults.slice(startIndex, startIndex + 10);
				next(err);
			});
	});

	view.on("init", next => {
		keystone.list("Article").model.count({}, (err, count) => {
			locals.data.maxPageNumber = Math.ceil(count / 10);
			locals.data.shouldHaveFirst = locals.data.pageNumber >= 3;
			locals.data.shouldHaveLast =
				locals.data.pageNumber <= locals.data.maxPageNumber - 2;
			next(err);
		});
	});

	// Render the view.
	view.render("latest_stories_standalone");
};
