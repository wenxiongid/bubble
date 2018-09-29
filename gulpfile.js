var webpackConfig = require('./webpack.config.js');

var gulp = require('gulp');
var path = require('path');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var zip = require('gulp-zip');
var archiver = require('archiver');
// var through = require('through2');
var compass = require('gulp-compass');

var low = require('lowdb');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var Q = require('q');
var crypto = require('crypto');
var projConfig = require('./proj.config.js');

var srcPath = __dirname + '/src/';
var distPath = __dirname + '/dist/';

const db = low('./db.json');
db.defaults({
  img: []
}).value();

/*
  for console
 */
var colors = require('colors/safe');

/*
  use for tasks
 */
var request = require('request');
var fs = require('fs');

function checkTaskFinish(restCount, callback){
  if(restCount === 0 && callback){
    callback();
  }
}

gulp.task('compass', function (cb) {
  gulp
    .src(srcPath + "sass/*.sass")
    .pipe(compass({
        css: srcPath + "css",
        sass: srcPath + "sass",
        image: srcPath + "img",
        generated_images_path: srcPath + "img"
      }))
    .pipe(gulp.dest(srcPath + "css"))
    .on("end", function() {
      cb();
    });
});

gulp.task('webpack', ['compass'], function(callback){
  webpack(webpackConfig, function(err, stats){
    if(err){
      throw new gutil.PluginError('webpack', error);
    }
    gutil.log('[webpack]', stats.toString());
    if(callback){
      callback();
    }
  });
});

gulp.task('webpack-dev-server', function(callback){
  var compiler = webpack(webpackConfig);
  new WebpackDevServer(compiler, {
    //
  }).listen(8080, 'localhost', function(err){
    if(err){
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
    if(callback){
      callback();
    }
  });
});

/*
  use for upload image
 */
gulp.task('uploadimg', ['compass'], function(callback){
  callback();
});

var relatedPathReg = new RegExp('[\./]*img/', 'g');
var imgPathReg = new RegExp('[\./]*img/([^\\\)"\']*)', 'g');

function replaceCdn(srcPath, distPath){
  var defferred = Q.defer();
  var pipe = gulp.src(srcPath);
  if(projConfig.useCDNImg){
    pipe.pipe(replace(imgPathReg, function(s, filename){
      var imgFileName = s.replace(relatedPathReg, '');
      var imgUrlInfo = db.get('img').find({
        name: imgFileName
      }).value();
      if(imgUrlInfo && imgUrlInfo.url){
        return imgUrlInfo.url;
      }else{
        gutil.log(colors.red('Cannot find image: ' + imgFileName));
        return s;
      }
    }));
  }
  pipe.pipe(gulp.dest(distPath))
    .on('finish', function(){
      defferred.resolve();
      gutil.log('finish replace ' + srcPath);
    });
  return defferred.promise;
}

gulp.task('replace-cdn', ['webpack', 'uploadimg'], function(callback){
  callback();
});

let exportFile = function(isDebug){
  var jsminDeferred = Q.defer();
  var cssminDeferred = Q.defer();
  let pipe = gulp.src(distPath + 'js/*.js');
  if(!isDebug){
    pipe.pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'));
  }
  pipe
    .pipe(gulp.dest(distPath + 'js/'))
    .on('finish', function(){
      jsminDeferred.resolve();
    });
  if(projConfig.mergeCss){
    cssminDeferred.resolve();
  }else{
    gulp.src(distPath + 'css/*.css')
      .pipe(minify())
      .pipe(gulp.dest(distPath + 'css/'))
      .on('finish', function(){
        cssminDeferred.resolve();
      });
  }
  return Q.allSettled([cssminDeferred, jsminDeferred]);
};

gulp.task('default', ['replace-cdn'], function(){
  return exportFile(true);
});

gulp.task('deploy', ['default'], function(done){
  exportFile(false).then(function(){
    var output = fs.createWriteStream(path.resolve(__dirname, 'deploy.zip'));
    var archive = archiver('zip');
    archive.on('error', function(err){
      throw err;
    });
    archive.on('close', function(){
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      done();
    });
    archive.pipe(output);
    archive.glob('dist/**/*', {
      cwd: __dirname,
      ignore: ['**/*.map']
    }, {});
    archive.finalize();
  });
});