const gulp = require('gulp');

const $ = require('../plugins');
const conf = require('../conf').pug;
const pugPHPFilter = require('pug-php-filter');

gulp.task('pug', () => {
  conf.opts.filters = {
    php: pugPHPFilter
  };
  return gulp.src(conf.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
    }))
    .pipe($.data((file) => {
      return { data: require(`../../${conf.json}`) }
    }))
    .pipe($.pug(conf.opts))
    .pipe($.rename(path => {
      path.dirname = path.dirname.replace('html', '.');
      path.extname = ".php";
    }))
    .pipe(gulp.dest(conf.dest));
});
