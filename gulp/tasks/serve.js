const gulp = require('gulp');
const yargs = require('yargs').argv;
const connect = require('gulp-connect-php');
const browserSync = require('browser-sync');

const conf = require('../conf').serve;

gulp.task('serve', () => {
  const opt = (yargs.build == true) ? conf.connect.build : conf.connect.dest;
  connect.server(opt, () => {
    browserSync(conf.browserSync);
  })
});
