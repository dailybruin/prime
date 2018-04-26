var keystone = require("keystone");

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	console.log(req.query.query);

	// Render the view.
	view.render("search");
};
