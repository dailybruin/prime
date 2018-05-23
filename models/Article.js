let mongoose = require("mongoose");
let Schema = mongoose.Schema;

/**
 * Article Model
 */
let ArticleSchema = new Schema({
	endpoint: { type: String },
	template: { type: String, default: "article" },
	slug: { type: String },
	modelSlug: { type: String }, // NOT the same as slug - this is the slug as it is stored in Kerchoff.
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
