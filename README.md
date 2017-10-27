# Flatpage Template Generator

## Getting Started
1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install/) and [gulp-cli](https://www.npmjs.com/package/gulp-cli).
2. Clone this repo (`git clone https://github.com/daily-bruin/flatpage-template.git`) and run yarn (`yarn`).
3. You're ready to develop a flatpage! Run `gulp` to run in development mode and `gulp build` when you're ready for production. `gulp clean` cleans any generated files so you can start fresh. 

## Structure
```
flatpage-template/
├── README.md           # This README!
├── gulpfile.babel.js   # The gulpfile that does everything.
├── package.json        # A Node convention, package.json keeps info about our project and manages dependencies.
├── dev/                # Compiled, rendered, and bundled source code for a development environment.
├── prod/               # Compiled, rendered, bundled, and minified code read for a production release.
├── src                 # Source code for your flatpage!
│   ├── img/            # Images folder
│   ├── scss/           # Sass folder
│   ├── js/             # JavaScript folder
│   ├── index.njk
│   ├── partials/       # Nunjucks folder
│   └── vendor/         # Vendor code, code written by people other than DBers. This is where library code, etc. goes.
└── yarn.lock
```

## Techonologies Used
- [Gulp](https://gulpjs.com)
- [Autoprefixer](http://autoprefixer.github.io)
- [Sass](http://sass-lang.com)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Browsersync](https://browsersync.io)
- [Babel](https://babeljs.io)
- [Webpack](https://webpack.js.org)
- [Eslint](https://eslint.org)
- [Stylelint](https://stylelint.io)
- [Prettier](https://prettier.io)
