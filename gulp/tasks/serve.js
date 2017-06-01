const gulp = require('gulp');
const yargs = require('yargs').argv;
const connect = require('gulp-connect-php');
const browserSync = require('browser-sync');
const path = require("path");
const slash = require('slash');
const fs = require('fs');
const url = require("url");
const pug = require('pug');
const pugPHPFilter = require('pug-php-filter');

const DIR = require('../conf').DIR;
const conf = require('../conf').serve;
const confPug = require('../conf').pug;

const getPugTemplatePath = (baseDir, req)=>{
  const requestPath = url.parse(req.url).pathname;
  const suffix = path.parse(requestPath).ext ? '' : 'index.php';
  return path.join(baseDir, "src/html", requestPath, suffix);
}

const pugMiddleWare = (req, res, next) => {
  const requestPath = getPugTemplatePath(process.cwd(), req);
  if (path.parse(requestPath).ext !== '.html') {
    return next();
  }
  let pugPath = slash(requestPath.replace('.html', '.pug'));
  if (DIR.PATH.length > 0) {
    pugPath = pugPath.replace(DIR.PATH, '/');
  }
  console.log("[BS] try to file "+ pugPath);
  const content = pug.renderFile(pugPath, {
    data: JSON.parse(fs.readFileSync(confPug.json)),
    pretty: true,
    filters: {
      php: pugPHPFilter
    }
  });
  res.end(new Buffer(content));
}

gulp.task("serve",()=> {
  const opt = (yargs.build == true) ? conf.connect.build : conf.connect.dest;
  conf.browserSync.middleware = [pugMiddleWare];
  connect.server(opt, () => {
    browserSync(conf.browserSync);
  })
});
