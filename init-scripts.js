const fm = require("front-matter");
const marked = require("marked");
const fetch = require("node-fetch");
const slug = require("slug");
const Article = require("./db.js").Article;
const currentissue = require("./config.js").issue;

/**
 * Add an article to the database.
 * @param {Article} articlejson - The article itself, retrieved from the endpoint.
 * @param {String} endpoint - The kerchoff endpoint used to retrieve this article.
 */
function createArticle(articlejson, endpoint) {
	let article = new Article().schema.obj;

	// Parse metadata.
	let articledata = fm(articlejson.cached_article_preview);
	let metadata = articledata.attributes;

	let renderer = new marked.Renderer();
	renderer.image = (href, title, text) => {
		let info = text.split("|");
		return `<div class="article__inlineimg ${info[1]}">
		<img src="${href}" />
		<div class="article__block-imgbox-photo-credit-wrapper">
		<div class="article__block-imgbox-photo-credit-name">${info[0]}</div>
		<div class="article__block-imgbox-photo-credit-title">/ daily bruin</div>
		</div>
		</div>`;
	};

	// Parse article markdown into html.
	let md = articledata.body;
	let html = marked(md, { renderer: renderer });

	let imgurl = "";
	if (metadata.cover && metadata.cover.img) {
		// some paths have format: prime/spring-2017/article/IMG_7274.JPG
		// should be: IMG_7274.JPG
		// THUS: substring from the last index of '/', -1 when not found
		let fixedImagePath = metadata.cover.img.substring(
			metadata.cover.img.lastIndexOf("/") + 1
		);
		let s3ImageObject = articlejson.images.s3[fixedImagePath] || {};
		imgurl = s3ImageObject.url || "";
	}

	let gallery = metadata.gallery
		? metadata.gallery.map(
				image =>
					articlejson.images.s3[image.substring(image.lastIndexOf("/" + 1))].url
		  )
		: [];

	let issueslug = metadata.issue.toLowerCase().replace(/\s+/g, "");
	let titleslug = slug(metadata.title).toLowerCase();

	article = new Article({
		endpoint: endpoint,
		template: metadata.template ? metadata.template.toLowerCase() : "article",
		modelSlug: articlejson.slug,
		slug: titleslug,
		featured: article.issue == currentissue ? "featured" : "no",
		section: metadata.category.toLowerCase(),
		issue: issueslug,
		state: "published",
		title: metadata.title,
		author: metadata.author,
		cover: {
			imgurl: imgurl,
			author: metadata.cover ? metadata.cover.author : ""
		},
		content: {
			body: {
				html: html,
				md: md
			},
			excerpt: metadata.excerpt
		},
		path: issueslug + "/" + titleslug,
		prettyIssue: metadata.issue,
		gallery: gallery
	});

	article.save(function(err) {
		if (err) {
			console.error(
				"Error saving article " + article.title + " to the database."
			);
			console.error(err);
		}
		console.log("Added article " + article.title + " to the database.");
	});
}

let loadArticles = async function() {
	let link = null;
	// Fetch each individual article and load into database.
	let endpoints_response = await fetch(
		"https://kerckhoff.dailybruin.com/api/packages/prime?endpoints=true&all=true"
	);
	let endpoints = await endpoints_response.json();

	let tasks = [];
	for (let endpoint of endpoints.data) {
		// Check if this article already exists.
		let task = async () => {
			try {
				let found = await Article.findOne({ modelSlug: endpoint.slug }).exec();
				if (found) {
					console.log(found.modelSlug + " exists! Skipping.");
					return;
				}
				// Article wasn't found. Fetch it.
				let article_endpoint_link =
					"https://kerckhoff.dailybruin.com" + endpoint.endpoint;
				let article_response = await fetch(article_endpoint_link);
				let article = await article_response.json();
				// Store the article in the db.
				createArticle(article, article_endpoint_link);
			} catch (err) {
				console.error(
					"Error saving article " + endpoint.slug + " to the database."
				);
				// console.error(err);
			}
		};
		tasks.push(task());
	}
	await Promise.all(tasks); // Run all the promises in parallel.
	console.log("Done loading articles.");
};

module.exports = loadArticles;
