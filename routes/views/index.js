var keystone = require("keystone");

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
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = "home";

	locals.data = {
		config: null,
		featured: null, // Site-wide featured articles as specified in config.
		mainarticle: null, // Main Article as specified in config.
		articles: null // All articles.
	};

	view.on("init", async function(next) {
		// Load global config.
		try {
			locals.data.config = await keystone.list("Configuration").model.findOne();

			locals.data.mainarticle = await keystone
				.list("Article")
				.model.findOne({ slug: locals.data.config.mainarticle })
				.populate("article" /*issue'*/);

			locals.data.featured = await keystone
				.list("Article")
				.model.find()
				.where("slug")
				.in(locals.data.config.featured)
				.populate("article" /*issue'*/);

			console.log(
				locals.data.config.featured + [locals.data.config.mainarticle]
			);

			let allResults = await keystone
				.list("Article")
				.model.find({
					state: "published"
				})
				.where("slug")
				.nin(locals.data.config.featured + [locals.data.config.mainarticle]);

			allResults = allResults.map(o => o.toObject());
			let sortedResults = allResults.slice();
			sortedResults.sort(sortByIssueReversed);
			locals.data.articles = sortedResults.slice(0, 5);

			// locals.data.articles = await keystone.list('Article').model
			// 	.find({
			// 		state: 'published',
			// 		 // Only load articles from the ucrrent issue into the index.
			// 	}).where('slug')
			// 	.nin(locals.data.config.featured + [locals.data.config.mainarticle])
			// 	.sort('-issue')
			// 	.populate('article' /*issue'*/);
		} catch (e) {
			next(e);
		}

		next();
	});

	// Render the view
	view.render("index");
};
