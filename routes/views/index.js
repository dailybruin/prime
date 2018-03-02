var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {};

	view.on('init', async function(next) {
		// Load global config.
		locals.data.config = await keystone.list('Configuration').model.findOne();
	})

	// Render the view
	view.render('index');
};
