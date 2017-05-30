// https://css-tricks.com/gulp-for-beginners/

// Siimple gulp tasks for concatenation and minification of static website projects
// run 'gulp build'
// Destination / target directory is 'dist'

// Parameters:
// gulp build --appcache false
//

// FUTURE IDEAS:
// Remove unnecessary CSS with UNCSS:
// http://126kr.com/article/91kyse7an3u
// Here the gulp plugin: https://github.com/ben-eb/gulp-uncss


var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var del = require('del');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var manifest = require('gulp-manifest');
var replace = require('gulp-replace');
var gutil = require("gulp-util");
var webpack = require('webpack-stream');
var fs = require("fs");


// fetch command line arguments and store in variable 'arg'
// eg.: gulp hello --username john --password pwd 
//      will return { username: 'john', password: 'pwd' }
var arg = (argList => {
  var arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');
    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    }
    else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }
  return arg;
})(process.argv);



// hello world
gulp.task('hello', function() {
  console.log('Hello World');
  console.log(arg)
});



// Run Webpack and compile js
gulp.task('webpack', function() {
  console.log('Running Webpack...');
  return gulp.src('src/js/my-app.js')
      .pipe(webpack( require('./webpack.config.watch.js') ))
      .pipe(gulp.dest('dev/js-bundled/'));
});




// Analyzes HTML files for JS and CSS sources, concatenates and minifies them
// In index.html the paths to the single JS and CSS files will be replaced by the minified ones, these sections are marked with <!--build: .... -->
gulp.task('userefWEG', function(){
  var stream = gulp.src('src/*.html')
    .pipe(useref())
    
     if (arg.appcache == 'false') {
        console.log('No appcache generated.');
        stream
            .pipe(replace('<!-- gulp-build: include appcache-nanny.js here -->', '<!-- gulp build info: No appcache-nanny integrated -->'))
    }
    else {
        stream
            .pipe(replace('<!-- gulp-build: include appcache-nanny.js here -->', '<script type="text/javascript" src="appcache-nanny.js" async></script>'))
    }
    
    // String replace some parts for final build
    stream
        .pipe(replace('<!-- gulp-build: include loading-spinner here -->', fs.readFileSync('./src/loading-spinner.include')))
    
    // Minifies JS
        .pipe(gulpIf('src/js/*.js', uglify()))

    // Minifies CSS
        .pipe(gulpIf('src/css/*.css', cssnano()))

        .pipe(gulp.dest('dist'))
    
  return stream;
});

gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    
    // String replace some parts for final build
    .pipe(replace('<!-- gulp-build: include appcache-nanny.js here -->', '<script type="text/javascript" src="appcache-nanny.js" async></script>'))
    .pipe(replace('<!-- gulp-build: include loading-spinner here -->', fs.readFileSync('./src/loading-spinner.include')))
    
    // Minifies JS
    .pipe(gulpIf('src/js/*.js', uglify()))

    // Minifies CSS
    .pipe(gulpIf('src/css/*.css', cssnano()))

    .pipe(gulp.dest('dist'))
});



gulp.task('copyfonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})


gulp.task('copyimages', function() {
  return gulp.src('f7/examples/plasma-agcs-digpos/img/**/*')
  .pipe(gulp.dest('dist/img'))
})

gulp.task('copyjs', function() {
  return gulp.src(['src/vendor/appcache-nanny/appcache-nanny.js','src/vendor/appcache-nanny/appcache-loader.html'])
  .pipe(gulp.dest('dist'))
})

// Copy the extra CSS files
gulp.task('copycss', function() {
  return gulp.src([
      'f7/examples/plasma-central/css/plasma-desktop-style.css' , 
      'f7/examples/plasma-central/css/plasma-tablet-style.css' ])
  .pipe(gulp.dest('dist/css'))
})


gulp.task('optimizeimages', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});



gulp.task('clean:dist', function() {
  return del.sync('dist');
})


gulp.task('clean:dev', function() {
  return del.sync('dev');
})


gulp.task('manifest', function(){
  gulp.src(['dist/**/*'], { base: './dist/' })
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'manifest.appcache',
      exclude: 'manifest.appcache'
     }))
    .pipe(gulp.dest('dist'));
});




gulp.task('build', function (callback) {
  runSequence(
    'clean:dev', 
    'clean:dist', 
    'webpack',
    'useref',
    ['copycss', 'copyimages', 'copyjs'],
    'manifest',
    callback
  )
})


//gulp.task('buildOLD', function (callback) {
//  runSequence('clean:dist', 
//    ['useref', 'copyfonts', 'optimizeimages'],
//    'manifest',
//    callback
//  )
//})
