var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var gulp = require("gulp");
var path = require("path");
var spritesmith = require('gulp.spritesmith');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require("autoprefixer");
var replace = require("gulp-replace");
var del = require('del');
var runSequence = require("run-sequence");
var archiver = require("archiver");
var cleanCss = require('gulp-clean-css');
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");

var log = require('fancy-log');
var request = require("request");
var PluginError = require("plugin-error");
var fs = require('fs');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var crypto = require('crypto');



var adapter = new FileSync("./db.json");
var db = low(adapter);
db.defaults({
  img: []
}).write();
var projConfig = require('./proj.config.js');
var srcPath = path.resolve(__dirname, 'src');
var distPath = path.resolve(__dirname, 'dist');

gulp.task('clean', function(callback){
  del([
    path.resolve(distPath, 'css'),
    path.resolve(distPath, 'js'),
    path.resolve(distPath, '*.html')
  ]).then(function(){
    callback();
  });
});

gulp.task('webpack', function(callback){
  var config = Object.assign({}, webpackConfig, {
    mode: 'production'
  });
  webpack(config, function(err, stats){
    if(err){
      throw new PluginError('webpack', err);
    }else{
      log('[webpack]', stats.toString());
      if (callback) {
        callback();
      }
    }
  });
});

gulp.task('webpack-dev-server', function(callback){
  var config = Object.assign({}, webpackConfig, {
    mode: 'development'
  });
  new webpackDevServer(webpack(config), {
    stats: {
      colors: true
    }
  }).listen("9000", "localhost", function(err) {
    if (err) {
      log.error(err);
    } else {
      log.info("[webpack-dev-server]", "http://localhost:9000/webpack-dev-server/src/index.html");
      callback();
    }
  });
});

gulp.task('sprite', function(callback){
  var imgPath = path.resolve(srcPath, "img");
  var sassPath = path.resolve(srcPath, 'sass');
  var toDoCount = 0;
  var finishCount = 0;
  fs.readdir(imgPath, function(readErr, files){
    if(files.length > 0){
      files.forEach(function (name) {
        if (name.indexOf('sprite_') === 0) {
          var spriteDirPath = path.resolve(imgPath, name);
          fs.stat(spriteDirPath, function (statErr, stat) {
            if (stat.isDirectory()) {
              toDoCount++;
              var spritePattern = path.resolve(spriteDirPath, '*.png');
              var folderName = name.replace('sprite_', '');
              var spriteData = gulp.src(spritePattern)
                .pipe(spritesmith({
                  imgName: folderName + '_sprite.png',
                  cssName: folderName + '_sprite.sass',
                  padding: 10,
                  imgPath: '../img/' + folderName + '_sprite.png',
                  algorithm: 'top-down',
                  cssVarMap: function (sprite) {
                    sprite.name = `${folderName}_${sprite.name}`
                  },
                  cssTemplate: './template.sass'
                }));
              var imgStream = spriteData.img
                .pipe(gulp.dest(imgPath));
              var cssStream = spriteData.css
                .pipe(gulp.dest(sassPath));
              merge(imgStream, cssStream).on('finish', function () {
                finishCount++;
                if (finishCount == toDoCount) {
                  callback();
                }
              });
            }
          });
        }else{
          if (finishCount == toDoCount) {
            callback();
          }
        }
      });
    }else{
      callback();
    }
  });
});

gulp.task('sass', ['sprite'], function(){
  var sassPath = path.resolve(srcPath, "sass");
  var cssPath = path.resolve(srcPath, "css");
  return gulp.src(path.resolve(sassPath, '*.sass'))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(cssPath));
});

gulp.task('css', ['sass'], function(){
  var srcCssPath = path.resolve(srcPath, "css", '*.css');
  var distCssPath = path.resolve(distPath, "css");
  var plugins = [autoprefixer()];
  return gulp.src(srcCssPath)
    .pipe(postcss(plugins))
    .pipe(gulp.dest(distCssPath));
});

gulp.task('watch-css', function(callback){
  var watcher = gulp.watch([
    path.resolve(srcPath, 'img', '**.*'),
    path.resolve(srcPath, 'sass', '*.sass')
  ], ['css']);
  callback();
});

/*
  use for upload image
 */
function checkTaskFinish(count, callback) {
  if (count <= 0) {
    callback();
  }
}
gulp.task('uploadimg', ['css'], function(callback) {
  var imgPath = path.resolve(srcPath, 'img');
  log.info('start upload image...');
  if (projConfig.useCDNImg) {
    fs.access(imgPath, function (err) {
      if (err) {
        log.error('Access illegal url: ' + imgPath);
      } else {
        fs.readdir(imgPath, function (err, files) {
          if (err) {
            log.error('Cannot read url: ' + imgPath);
            return;
          }
          var fileCount = 0;
          var toUploadImgNames = [];
          files.forEach(function (name, i) {
            var extName = name.substr(name.lastIndexOf('.') + 1);
            if (name.indexOf('.') != 0 && (extName == 'png' || extName == 'jpg')) {
              fileCount++;
              toUploadImgNames.push(name);
            }
          });
          checkTaskFinish(fileCount, callback);
          toUploadImgNames.forEach(function (name) {
            var filePath = path.resolve(imgPath, name);
            var rs = fs.createReadStream(filePath);
            var hash = crypto.createHash('md5');
            rs.on('data', hash.update.bind(hash));
            rs.on('end', function () {
              var md5 = hash.digest('hex');
              if (db.get('img').find({
                md5: md5,
                name: name
              }).value()) {
                log('already uploaded: ' + name);
                checkTaskFinish(--fileCount, callback);
              } else {
                var r = request.post('http://10.187.139.235/util/upload.action', function(err, httpResponse, body) {
                  if (err) {
                    log.error('upload error: ' + name);
                    log.error(err);
                  }
                  if (body) {
                    var result = JSON.parse(body);
                    if (typeof result == 'object') {
                      for (var filename in result) {
                        db.get('img').remove({
                          name: filename
                        }).value();
                        db.get('img').push({
                          md5: md5,
                          name: filename,
                          url: result[filename]
                        }).value();
                        db.write();
                        log.info('upload success: ' + name);
                        checkTaskFinish(--fileCount, callback);
                      }
                    }
                  }
                });
                var form = r.form();
                form.append('upload', fs.createReadStream(filePath));
                log('uploading: ' + name);
              }
            });
          });
        });
      }
    });
  } else {
    gulp.src(path.resolve(imgPath, '*.*'))
      .pipe(gulp.dest(path.resolve(distPath, 'img')))
      .on('finish', function (){
        callback();
      });
  }
});

/*
  use for replace cdn
*/
var relatedPathReg = new RegExp('[\./]*img/', 'g');
var imgPathReg = new RegExp('[\./]*img/([^\\\)"\']*)', 'g');

function replaceCdn(srcPath, distPath) {
  return new Promise(function(resolve, reject){
    var pipe = gulp.src(srcPath);
    if (projConfig.useCDNImg) {
      pipe.pipe(replace(imgPathReg, function (s, filename) {
        var imgFileName = s.replace(relatedPathReg, '');
        var imgUrlInfo = db.get('img').find({
          name: imgFileName
        }).value();
        if (imgUrlInfo && imgUrlInfo.url) {
          return imgUrlInfo.url;
        } else {
          log.error('Cannot find image: ' + imgFileName);
          return s;
        }
      }));
    }
    pipe.pipe(gulp.dest(distPath))
      .on('finish', function () {
        resolve();
        log('finish replace ' + srcPath);
      });
  });
}

gulp.task("replace-cdn", function(callback) {
  var promiseList = [];
  fs.access(srcPath, function(err) {
    if (err) {
      log.error("Access illegal url: " + srcPath);
    } else {
      // repalce html files
      log.info("start replace html image url...");
      promiseList.push(replaceCdn(path.resolve(distPath, "*.html"), distPath));
      // replace css files
      log.info("start replace css image url...");
      promiseList.push(
        replaceCdn(
          path.resolve(distPath, "css", "*.css"),
          path.resolve(distPath, "css")
        )
      );
      // replace js files
      log.info("start replace js image url...");
      promiseList.push(
        replaceCdn(
          path.resolve(distPath, "js", "*.js"),
          path.resolve(distPath, "js")
        )
      );
    }
    Promise.all(promiseList).then(function() {
      callback();
    });
  });
});

gulp.task('clean-css', function(callback){
  var cssPath = path.resolve(distPath, "css");
  gulp.src(path.resolve(cssPath, '*.css'))
    .pipe(cleanCss({
      debug: true,
      keepSpecialComments: '*'
    }, function(details){
      log(`${details.name}: ${details.stats.originalSize}`);
      log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(gulp.dest(cssPath))
    .on('finish', function(){
      callback();
    });
});

gulp.task('uglify', function(callback){
  var jsPath = path.resolve(distPath, 'js');
  gulp.src(path.resolve(jsPath, '*.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsPath))
    .on('finish', function(){
      callback();
    });
});

gulp.task('zip', function(callback){
  var output = fs.createWriteStream(path.resolve(__dirname, "deploy.zip"));
  var archive = archiver('zip');
  archive.on('error', function (err) {
    throw err;
  });
  archive.on('finish', function(){
    log(archive.pointer() + " total bytes");
    log("archiver has been finalized and the output file descriptor has closed.");
    callback();
  });
  archive.pipe(output);
  archive.glob('dist/**/*', {
    cwd: __dirname,
    ignore: ['**/*.map']
  }, {});
  archive.finalize();
});

gulp.task('default', function(callback){
  // runSequence("clean", ["webpack", "css"], "replace-cdn", "clean-css", "zip", callback);
  runSequence(['webpack', 'css'], 'replace-cdn', 'clean-css', 'zip', callback);
});

gulp.task('dev', function(callback){
  runSequence("clean", ["webpack-dev-server", "watch-css"], callback);
});