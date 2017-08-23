import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import sass from 'gulp-sass';
import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import bs from 'browser-sync';
import del from 'del';

const browserSync = bs.create();

function clean() {
  return del(['build/']);
}

gulp.task('default', clean);

gulp.task('styles', () =>
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
);

gulp.task('scripts', () =>
  gulp
    .src('src/js/index.js')
    .pipe(
      webpack({
        output: {
          filename: 'bundle.js',
        },
      })
    )
    .pipe(gulp.dest('build/js'))
);

gulp.task('html', () =>
  gulp
    .src('src/*.html')
    .pipe(
      nunjucksRender({
        path: ['src/partials/'],
      })
    )
    .pipe(gulp.dest('build/'))
);

gulp.task('browser-sync', () => {
  gulp.task('browser-sync', () => {
    browserSync.init({
      server: {
        baseDir: './build',
      },
    });
  });
});
