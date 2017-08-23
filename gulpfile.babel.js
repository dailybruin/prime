import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import bs from 'browser-sync';

const browserSync = bs.create();

gulp.task('default', () => {});

gulp.task('style', () =>
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
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
