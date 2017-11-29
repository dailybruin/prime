import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';
import _ from 'lodash';

// Images
import imagemin from 'gulp-imagemin';

// HTML
import htmlmin from 'gulp-htmlmin';

// Styling related packages
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import minifyCSS from 'gulp-csso';

// JavaScript
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';

import sourcemaps from 'gulp-sourcemaps';
import bs from 'browser-sync';
import del from 'del';

import contentParser from './contentparser';

const browserSync = bs.create();

gulp.task('contentimages:dev', () =>
  gulp.src('content/**/*.+(jpg|png|jpeg)').pipe(gulp.dest('dev/img'))
);

gulp.task('contentimages:prod', () =>
  gulp
    .src('content/**/*.+(jpg|png|jpeg)')
    .pipe(imagemin())
    .pipe(gulp.dest('prod/img'))
);

gulp.task('images:dev', () => gulp.src('src/img/*').pipe(gulp.dest('dev/img')));

gulp.task('images:prod', () =>
  gulp
    .src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('prod/img'))
);

gulp.task('styles:dev', () =>
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dev/css'))
    .pipe(browserSync.stream())
);

gulp.task('styles:prod', () =>
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./prod/css'))
    .pipe(browserSync.stream())
);

const webpackConfig = {
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
  },
};

gulp.task('scripts:dev', () =>
  gulp
    .src('src/js/index.js')
    .pipe(sourcemaps.init())
    .pipe(webpack(webpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dev/js'))
);

gulp.task('scripts:prod', () =>
  gulp
    .src('src/js/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(
      uglify().on('error', e => {
        console.log(e);
      })
    )
    .pipe(gulp.dest('prod/js'))
);

gulp.task('html:dev', () =>
  contentParser().then(d => {
    d.categories.forEach(category => {
      d.category = category;
      d.this = d[category];
      nunjucks.configure('src/');
      let res = nunjucks.render('./section.njk', d);

      fs.writeFile('dev/' + category + '.html', res, 'utf8', err => {
        if (err) throw err;
        console.log('Compiled ' + 'dev/' + category + '.html');
      });
    });

    _.forEach(d.data, (article, slug) => {
      nunjucks.configure('src/');
      let res = '';
      if (article.comic) {
        res = nunjucks.render('./comic.njk', article);
      } else {
        res = nunjucks.render('./article.njk', article);
      }
      fs.outputFile(
        'dev/' + article.iss + '/' + slug + '.html',
        res,
        'utf8',
        err => {
          if (err) throw err;
          console.log(
            'Compiled ' + 'dev/' + article.iss + '/' + slug + '.html'
          );
        }
      );
    });

    //index, other statics
    gulp
      .src('src/*.{njk,html}')
      .pipe(
        nunjucksRender({
          path: ['src/'],
          data: d,
        })
      )
      .pipe(gulp.dest('dev/'));
  })
);

gulp.task('html:prod', () =>
  gulp
    .src('src/*.{njk,html}')
    .pipe(
      nunjucksRender({
        path: ['src/'],
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('prod/'))
);

gulp.task(
  'development',
  ['html:dev', 'styles:dev', 'scripts:dev', 'images:dev', 'contentimages:dev'],
  () => {
    browserSync.init({
      server: {
        baseDir: './dev',
        serveStaticOptions: {
          extensions: ['html'],
        },
      },
    });

    gulp.watch('./src/img/**/*', ['images:dev']);
    gulp.watch('./src/scss/**/*.scss', ['styles:dev']);
    gulp.watch('./src/js/**/*.js', ['scripts:dev']);
    gulp
      .watch('src/**/*.{njk,html}', ['html:dev'])
      .on('change', browserSync.reload);
  }
);

gulp.task('production', [
  'html:dev', //temporary
  'styles:prod',
  'scripts:prod',
  'images:prod',
]);

gulp.task('clean', () => del(['dev/', 'prod/']));
gulp.task('default', ['development']);
gulp.task('build', ['production']);
