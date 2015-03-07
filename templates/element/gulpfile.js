'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var through = require('through2');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var pkg = require('./package.json');

gulp.task('default', function () {

  var normal = bundle(pkg.name + '.js')
    .pipe(sourcemaps.init({ loadMaps: true }));

  var min = bundle(pkg.name + '.min.js')
    .pipe(uglify());

  var search = new RegExp(process.cwd(), 'g');
  var replacement = pkg.name;

  return merge(normal, min)
    .pipe(replace(search, replacement))
    .pipe(prefixBanner())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/'));
});

function bundle(name) {

  var bundler = browserify({
      entries: ['./lib/' + pkg.reactInitOptions.entryFile],
      standalone: pkg.reactInitOptions.exportVar,
      debug: true
    });
  // NOTE: transforms specified in package.json

  return bundler
    .bundle()
    .pipe(source(name))
    .pipe(buffer());
}

function replace(search, replacement) {
  return through.obj(function (file, encoding, callback) {
    file.contents = new Buffer(String(file.contents).replace(search, replacement));
    this.push(file);
    return callback();
  });
}

function prefixBanner() {

  var banner = ['/**',
    ' * ' + pkg.name + ' - ' + pkg.description,
    ' * @version ' + pkg.version,
    ' * @link ' + pkg.homepage,
    ' * @license ' + pkg.license,
    ' * @element ' + pkg.reactInitOptions.exportVar,
    ' */',
    ''].join('\n');

  banner = new Buffer(banner);

  return through.obj(function (file, encoding, callback) {
    file.contents = Buffer.concat([banner, file.contents]);
    this.push(file);
    return callback();
  });
}
