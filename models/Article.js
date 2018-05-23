let mongoose = require("mongoose");
let Schema = mongoose.Schema;

/**
 * Article Model
 */
let ArticleSchema = new Schema({
	endpoint: { type: String },
	template: { type: String, default: "article" },
	modelSlug: { type: String },
	featured: {
		type: String,
		default: "no",
		enum: ["no", "featured", "main feature"]
	},
	section: { type: String },
	issue: { type: String },
	state: {
		type: String,
		enum: ["draft", "published", "archived"],
		default: "draft",
		index: true
	},
	publishedDate: { type: Date, default: Date.now, index: true },
	title: { type: String },
	author: { type: String },
	cover: {
		imgurl: { type: String },
		author: { type: String }
	},
	content: {
		body: { html: { type: String }, md: { type: String } },
		excerpt: { type: String }
	},
	path: { type: String },
	prettyIssue: { type: String },
	gallery: { type: [String] },
	hitCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Article", ArticleSchema);
