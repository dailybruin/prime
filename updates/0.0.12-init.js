
var keystone = require('keystone');
var async = require('async');
var User = keystone.list('User');
var Configuration = keystone.list('Configuration');

let admins = [
	{ 'name.first': 'Admin', 'name.last': 'User', 'email': 'admin@dailybruin.com', 'password': 'admin', 'isAdmin': true },	
];
let config = [
	{ 'issue': 'winter2018', 'sections': ["arts", "culture", "lifestyle"], 'mainarticle': 'a-league-of-our-own', 'featured': []}
];

function createAdmin (admin, done) {
	var newAdmin = new User.model(admin);

	newAdmin.isAdmin = true;
	newAdmin.save(function (err) {
		if (err) {
			console.error('Error adding admin ' + admin.email + ' to the database:');
			console.error(err);
		} else {
			console.log('Added admin ' + admin.email + ' to the database.');
		}
	});
}

function createConfig(config, done) {
	let newConfig = new Configuration.model(config);

	newConfig.save(function (err) {
		if (err) {
			console.error('Error adding configuration options to the database.');
			console.error(err);
		} else {
			console.log('Added configuration options to the database.');
		}
	})
}

exports = module.exports = function (done) {
	async.forEach(admins, createAdmin, done);
	async.forEach(config, createConfig, done);
	done();
};
