var keystone = require('keystone');
var fm = require('front-matter');
var cm = require('commonmark');
var fetch = require('node-fetch');
var marked = require('marked');
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
	template: { label: "Article Template", type: String, default: "article" },
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
	},
	path: { type: String, hidden: true},
	prettyIssue: { type: String, hidden: true},
	gallery: { type: Types.TextArray, hidden: true },
	hitCount: { type: Number, default: 0 }
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
			
			// Set metadata.
			this.content.excerpt = metadata.excerpt;
			this.author = metadata.author;
			this.section = metadata.category.toLowerCase();
			this.cover.imgurl = metadata.cover? json.images.s3[metadata.cover.img].url : "";
			this.cover.author = metadata.cover? metadata.cover.author : "";
			this.title = metadata.title;
			this.prettyIssue = metadata.issue;
			this.issue = metadata.issue.toLowerCase().replace(/\s+/g, '');
			this.template = metadata.template? metadata.template.toLowerCase() : (this.template? this.template : "article"); // "article" is the default template.
			this.gallery = (metadata.gallery)? (metadata.gallery.map(image => json.images.s3[image].url)) : [];
			this.path = this.issue + '/' + this.slug;

			let renderer = new marked.Renderer();
			renderer.image = (href, title, text) => {
			  let info = text.split('|');
			  return `<div class="article__inlineimg ${info[1]}">
			  <img src="${href}" />
			  <div class="article__block-imgbox-photo-credit-wrapper">
				 <div class="article__block-imgbox-photo-credit-name">${
				   info[0]
				 }</div>
				 <div class="article__block-imgbox-photo-credit-title">/ daily bruin</div>
			  </div>
			 </div>`;
			};
		
			// Parse article markdown.
			//this.content.body.html = (new cm.HtmlRenderer()).render((new cm.Parser()).parse(markdown)); 
			this.content.body.html = marked(markdown, { renderer: renderer });
			this.content.body.md = markdown;

			next();
		}).catch((err) => {
			next(err); // Error.
		});
	}).catch((err) => {
		next(err); // Error.
	});
});

Article.defaultColumns = 'title, issue|20%, section|20%, template|20%';
Article.register();
