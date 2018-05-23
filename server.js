const port = process.env.PORT || 3000;
const express = require("express");
const path = require("path");
const createError = require("http-errors");
const nunjucks = require("nunjucks");
const sass = require("node-sass-middleware");

const app = express();

app.set("views", path.join(__dirname, "views"));
// Use Nunjucks as the view engine.
nunjucks.configure("views", {
	autoescape: true,
	express: app
});

// Autocompile sass.
app.use(
	sass({
		src: __dirname,
		dest: path.join(__dirname, "public/styles"),
		debug: false,
		outputStyle: "compressed",
		prefix: "/styles"
	})
);

// Define middleware.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // Files in /public are staticly served.

// Include config in all routes.
const config = require("./config");
app.use((req, res, next) => {
	res.locals.config = config;
	return next();
});

// Routes.
app.use("/:issue/:article", require("./routes/article"));
app.use("/past_issues", require("./routes/past_issues"));
app.use("/about-prime", require("./routes/about_prime"));
app.use("/all-stories", require("./routes/all_stories"));
app.use("/:section", require("./routes/section"));
app.use("/", require("./routes/index"));

/* GET home page. */
app.get("/", function(req, res, next) {
	res.redirect("courses");
});

/* Catch 404 */
app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	console.log(err.message);
	console.log(err);
	res.render("errors/500.njk");
});

app.listen(port, () => console.log(`Listening on port ${port}`));

const loadArticles = require("./init-scripts.js");
loadArticles();
