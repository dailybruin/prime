var keystone = require('keystone');
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
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	categories: {
		type: Types.Relationship, ref: 'ArticleCategory', many: true
	},
	issue: {
		type: Types.Relationship, ref: 'ArticleIssue', many: false //, required: true
	},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	cover: {
		imageurl: {label: "Cover Image URL", type: String},
		author: {label: "Cover Image Author", type: String}
	},
    content: {
        // TODO: Images can currently be pasted directly into the post; however,
        // there isn't currently a way to associate any metadata with the image
        // (specifically, alt-text and photo credit).
		body: { type: Types.Markdown, height: 800 },
		excerpt: { type: Types.Textarea, height: 80 },
	}
    // TODO: Tags? Important for search. Should be simple.
});

Article.schema.virtual('content.full').get(function () {
	return this.content.body || this.content.excerpt;
});

Article.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Article.register();
