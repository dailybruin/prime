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
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	coverimage: { type: Types.CloudinaryImage },
    article: {
        // TODO: Images can currently be pasted directly into the post; however,
        // there isn't currently a way to associate any metadata with the image
        // (specifically, alt-text and photo credit).
		excerpt: { type: Types.Html, wysiwyg: true, height: 120 },
		content: { type: Types.Html, wysiwyg: true, height: 800 },
	},
	categories: {
        type: Types.Relationship, ref: 'ArticleCategory', many: true
    },
    // TODO: Quarter? This would likely go into categories.
    // TODO: Tags? Important for search. Should be simple.
});

Article.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Article.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Article.register();
