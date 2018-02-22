require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var cons = require('consolidate');
var nunjucks = require('nunjucks');

keystone.init({
	'name': 'prime',
	'brand': 'prime',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',

	// We use nunjucks as the templating engine.
	'views': 'templates/views',
	'view engine': '.njk',
	'custom engine': cons.nunjucks,

	// Enables pasting/dragdrop of images into wysiwyg text fields.
	'wysiwyg additional plugins': 'paste',
	'wysiwyg additional options': {
		'paste_data_images': true
	},

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

keystone.import('models');

// Setup ommon locals for the templates.
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI.
keystone.set('nav', {
	articles: ['articles', 'article-categories'],
	users: 'users',
});

keystone.start();
