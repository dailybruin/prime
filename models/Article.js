var keystone = require('keystone');
var fm = require('front-matter');
var cm = require('commonmark');
var fetch = require('node-fetch');

var Types = keystone.Field.Types;

/**
 * Article Model
 * ==========
 */

var Article = new keystone.List('Article', {
	map: { name: 'title' }, // TODO: Is title unique?
	autokey: { path: 'slug', from: 'title', unique: true },
});

Article.add({
	endpoint: { type: String },
	modelSlug: { type: String, noedit: true },
	featured: {type: Types.Select, options: 'no, featured, main feature', default: 'no', note: "Is this a featured article in its section?"},
	section: {noedit: true, type: String },
	issue: {type: String},
	//issue: { type: Types.Relationship, ref: 'ArticleIssue', many: false },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	title: { type: String, required: true },
	// author: { hidden: true, type: Types.Relationship, ref: 'User', index: true },
	author: { noedit: true, type: String },
	// categories: { type: Types.Relationship, ref: 'ArticleCategory', many: true },
	cover: {
		imgurl: {noedit: true, label: "Cover Image URL", type: String},
		author: {noedit: true, label: "Cover Image Author", type: String}
	},
    content: {
		body: { noedit: true, type: Types.Markdown, height: 800 },
		excerpt: { noedit:true, type: Types.Textarea, height: 80 },
	}
	// TODO: Tags? Important for search. Should be simple.
});

Article.schema.virtual('content.full').get(function () {
	return this.content.body || this.content.excerpt;
});

Article.schema.pre('save', function (next) {
	if (!this.endpoint) {
		next();
	}
	// Fetch article from API endpoint.
	let doc = this;
	fetch(this.endpoint).then(response => {
		response.json().then(json => {
			let article = fm(json.cached_article_preview);
			let metadata = article.attributes;
			let markdown = article.body;
			
			// Parse article markdown.
			this.content.body.html = (new cm.HtmlRenderer()).render((new cm.Parser()).parse(markdown)); 
			this.content.body.md = markdown;
			// Set metadata.
			this.content.excerpt = metadata.excerpt;
			this.author = metadata.author;
			this.section = metadata.category.toLowerCase();
			this.cover.imgurl = metadata.cover? metadata.cover.img : "";
			this.cover.author = metadata.cover? metadata.cover.author : "";
			this.title = metadata.title;
			this.issue = metadata.issue;

			next();
		}).catch((err) => {
			next(err); // Error.
		});
	}).catch((err) => {
		next(err); // Error.
	});
});

Article.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Article.register();
