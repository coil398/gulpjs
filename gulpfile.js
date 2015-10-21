var gulp = require('gulp');
var webserver = require('gulp-webserver');

var typescript = require('gulp-typescript');
var concat = require('gulp-concat');

var browserify = require('browserify');
var source = require('vinyl-source-stream');

var cssbeautify = require('gulp-cssbeautify');

/*動かん
var uglify = require('gulp-uglify');
*/
var plumber = require('gulp-plumber');

gulp.task('typescript-compile',function(){
  //対象となるふぁいるを全指定
  gulp.src(['./htdocs/tsscripts/*.ts'])
  .pipe(plumber())
  .pipe(typescript({target:"ES5",removeComments:true,sortOutput:true}))
  //jsプロパティを参照
  .js
  //ファイルをひとまとめに
  .pipe(concat("script.js"))
  .pipe(gulp.dest('./htdocs/scripts/'));
});

gulp.task('browserify',['typescript-compile'],function(){
  browserify('./htdocs/scripts/script.js')
  .bundle()
  .pipe(source('main.js'))
  .pipe(gulp.dest('./htdocs/public'));
});

gulp.task('cssbeautify',function(){
  return gulp.src('./htdocs/css/main.css')
  .pipe(cssbeautify())
  .pipe(gulp.dest('css'));
});

/*
gulp.task('js.uglify',function(){
  return gulp.src('./htdocs/scripts/script.js')
  .pipe(plumber())
  .pipe(uglify('script.min.js'))
  .pipe(gulp.dest('./htdocs/scripts'));
});
*/

gulp.task('watch',function(){
  gulp.watch('./htdocs/tsscripts/*.ts',['browserify']);
  //gulp.watch('./htdocs/scripts/*.js',['js.uglify']);
  gulp.watch('./htdocs/css/main.css',['cssbeautify']);
});

gulp.task('default',['watch']);
