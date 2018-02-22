var keystone = require('keystone');

/**
 * ArticleCategory Model
 * ==================
 */

var ArticleCategory = new keystone.List('ArticleCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

ArticleCategory.add({
	name: { type: String, required: true },
});

ArticleCategory.relationship({ ref: 'Article', path: 'articles', refPath: 'categories' });

ArticleCategory.register();