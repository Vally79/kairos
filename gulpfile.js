'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
var stylish = require('jshint-stylish');

var mainFiles = [
  'src/kairos.js',
  'src/gnomon/Gnomon.js',
  'src/timer/Timer.js'
];

gulp.task('init', function () {
  return plugins.bower();
});

gulp.task('build', function (done) {
  return runSequence('clean', 'build-raw', 'build-min', 'build-debug', 'build-nodejs', done);
});

gulp.task('build-raw', function () {
  return gulp.src(mainFiles)
    .pipe(plugins.concat('kairos.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-min', function () {
  return gulp.src(mainFiles)
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(plugins.concat('kairos-min.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-debug', function () {
  return gulp.src(mainFiles)
    .pipe(plugins.concat('kairos-debug.js'))
    .pipe(banner())
    .pipe(gulp.dest('build'));
});

gulp.task('build-nodejs', function () {
    return gulp.src('src/kairos.js')
    .pipe(plugins.include())
      .on('error', console.log)
    .pipe(plugins.concat('kairos-node.js'))
    .pipe(banner())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function (done) {
  del(['build']).then(function () {
    done();
  });
});

gulp.task('docs', function () {
  return gulp.src(['src/**/*.js', 'README.md'])
    .pipe(plugins.jsdoc('docs'));
});

gulp.task('format', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.esformatter())
    .pipe(gulp.dest('src'));
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('serve', function () {
  return gulp.src('./')
    .pipe(plugins.webserver({
      directoryListing: true,
      open: true,
      port: process.env.PORT || '8000',
      host: process.env.IP || 'localhost'
    }));
});

gulp.task('watch', ['build', 'serve'], function () {
  gulp.watch(['src/**/*'], ['build']);
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test-watch', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

// Private helpers
// ===============

function banner() {
  var stamp = [
    '/**',
    ' * Kairos.js - <%= pkg.description %>',
    ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' * @version v<%= pkg.version %>',
    ' * @link https://github.com/kairos',
    ' * @license BSD',
    ' */',
    ''
  ].join('\n');

  return plugins.header(stamp, {
    pkg: pkg
  });
}
