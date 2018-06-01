# prime by The Daily Bruin

The official website for prime, the Daily Bruin’s quarterly arts, culture and lifestyle magazine.

## How To Run

1.  Install mongod and make sure it is running using `mongod`.
2.  Open mongo shell with `mongo`.
3.  Type `use prime` and then `db.dropDatabase()` to drop the prime database.
4.  Install npm.
5.  Run `npm install`.
6.  Run `node server.js`. The website should now be available at localhost:3000. (or whatever port you specify).
7.  Featured articles can be configured in config.js.
8.  Make sure to restart the server whenever changes are made to server-side code.

## Directory Structure

This project follows a model-view-controller architecture pattern.

.
├── models - used to specify the structure of the data we are interacting with in the database.
├── routes - stores the controllers, the server-side code used to make data available to the templates, then render them.
├── views - stores the nunjucks templates.
├── public - contains files that are publicly available (e.g. css files). scss files in this directory are automatically compiled to css files.
├── config.js - used to store information on featured articles. Refer to the comments in the file itself.
├── server.js - Entrypoint for the Node.js server. Used to specify which routes the site uses, and defines all middleware.
├── Dockerfile
├── utils.js
├── db.js - This file connects to the database and makes available the models (e.g. Article model) that can be used to query the database. Include this file in any file you need to perform database operations in.
Note - thanks to the way ES6 require() works, we only connect to the database once - not each time this is included.
└── init-scripts.js - The "loadArticles()" function in this file is run every time server.js starts. It is used to retrieve
all prime articles from Kerchoff and store them in the local mongo database.
