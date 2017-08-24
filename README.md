# Flatpage Template Generator

## Getting Started
0. [Install Yarn](https://yarnpkg.com/lang/en/docs/install/) and [gulp-cli](https://www.npmjs.com/package/gulp-cli) (`yarn global add gulp-cli`).
1. Clone this repo (`git clone https://github.com/daily-bruin/flatpage-template.git`) and run yarn (`yarn`).
2. You're ready to develop a flatpage! Run `gulp` to run in development mode and `gulp build` when you're ready for production. `gulp clean` cleans any generated files so you can start fresh. 

## Structure
```
flatpage-template/
├── README.md
├── gulpfile.babel.js
├── package.json
├── dev/
├── prod/
├── src
│   ├── img/
│   ├── scss/
│   ├── js/
│   ├── index.njk
│   ├── partials/
│   └── vendor/
└── yarn.lock
```
