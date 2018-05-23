let mongoose = require("mongoose");
let Schema = mongoose.Schema;

mongoose
	.connect(process.env.MONGO_URI || `mongodb://localhost/prime`)
	.then(() => {
		console.log("Database connection successful.");
	})
	.catch(err => {
		console.log("Database connection error.");
	});

let Article = require("./models/Article.js");

module.exports = {
	Article: Article
};
