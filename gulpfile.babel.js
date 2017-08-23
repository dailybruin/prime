import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import bs from 'browser-sync';

const browserSync = bs.create();

gulp.task('default', () => {});

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
