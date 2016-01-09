/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */
// npm install -D gulp gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-uglify gulp-imagemin gulp-rename gulp-concat gulp-notify gulp-sourcemaps gulp-livereload gulp-devserver gulp-html-replace del 
// Load plugins
var gulp = require('gulp'),
    // sass = require('gulp-ruby-sass'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    // server = require('gulp-devserver'),
    htmlreplace = require('gulp-html-replace'), // need
    del = require('del'),
		connect = require('gulp-connect'),
		watch = require('gulp-watch'),
		// Proxy = require('gulp-api-proxy');
		// Proxy = require('gulp-connect-proxy')
		Proxy = require('proxy-middleware');
// var gulpLoadPlugins = require('gulp-load-plugins'),
//     plugins = gulpLoadPlugins({lazy: false});
//     console.log(Object.keys(plugins));
var url = require('url');

var srcPath = {
  SRC : 'app',
  ENTRY_POINT: './app/scripts/app.js',
  HTML: 'app/index.html',
  SCSS: 'app/styles/*.scss',
  STYLES : 'app/styles',
  SCRIPTS : 'app/scripts/**/*.js',
  IMAGES : 'app/images/**/*',
  PARTIALS: 'app/partials/*',
  BOWER: 'app/bower_components/**/*'
}
var destPath = {
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  BUILD: 'dist/build',
  DEST_FILES : 'dist/**/*',
  HTML: 'dist/index.html',
  STYLES : 'dist/styles',
  SCRIPTS : 'dist/scripts',
  IMAGES : 'dist/images',
  PARTIALS: 'dist/partials',
  BOWER: 'dist/bower_components'
}

gulp.task('webserver', function() {
  connect.server({
  	root: './dist',
  	port:8080,
  	livereload: true,
  // 	middleware: function (connect, opt) {
		// 	// `localhost/server/api/getuser/1` will be proxied to `192.168.1.186/server/api/getuser/1` 
		// 	opt.route = '/api';
		// 	opt.context = 'localhost:3000/api';
		// 	var proxy1 = new Proxy(opt);
		// 	opt.route = '/Mapi';
		// 	opt.context = 'localhost:3000/Mapi';
		// 	var proxy2 = new Proxy(opt);
		// 	return [proxy1, proxy2];
		// }
		middleware: function (connect, opt) {
				var proxyOptions = url.parse('http://localhost:3000/');
				proxyOptions.route = '/proxy';
	      var proxy = new Proxy(proxyOptions);
	      return [proxy];
	  }
  });
});
 

//html
gulp.task('html', function() {
  return gulp.src(srcPath.HTML)
             // .pipe(htmlreplace({
             //      'haha': ['js/haha.min.js', 'dylan.css']
             //  }))
             // .pipe(connect.reload())
             .pipe(gulp.dest(destPath.DEST))
             .pipe(notify({ message: 'Html task complete' }))
});
gulp.task('partials', function() {
  return gulp.src(srcPath.PARTIALS)
             // .pipe(htmlreplace({
             //      'haha': ['js/haha.min.js', 'dylan.css']
             //  }))
             .pipe(gulp.dest(destPath.PARTIALS))
             .pipe(notify({ message: 'Partials task complete' }))
             // .pipe(connect.reload());
});
// Styles
gulp.task('styles', function() {
	return gulp.src(srcPath.SCSS)
				.pipe(sourcemaps.init())
   			.pipe(sass())
		    .pipe(autoprefixer('last 2 version'))
		    .pipe(gulp.dest(destPath.STYLES))
		    .pipe(rename({ suffix: '.min' }))
		    .pipe(minifycss())
   			.pipe(sourcemaps.write('./maps'))
		    .pipe(gulp.dest(destPath.STYLES))
		    .pipe(notify({ message: 'Styles task complete' }))
		    // .pipe(connect.reload());
});

 
// Scripts
gulp.task('scripts', function() {
  return gulp.src(srcPath.SCRIPTS)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(destPath.SCRIPTS))
    .pipe(rename({ suffix: '.min' }))
    // .pipe(uglify())
    .pipe(gulp.dest(destPath.SCRIPTS))
    .pipe(notify({ message: 'Scripts task complete' }))
    // .pipe(connect.reload());
});
gulp.task('bower', function() {
  return gulp.src(srcPath.BOWER)
    .pipe(gulp.dest(destPath.BOWER))
    .pipe(notify({ message: 'Bower task complete' }));
});
// Images
gulp.task('images', function() {
  return gulp.src(srcPath.IMAGES)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(destPath.IMAGES))
    .pipe(notify({ message: 'Images task complete' }))
    // .pipe(connect.reload());
});

// Clean
gulp.task('clean', function() {
  return del(destPath.DEST_FILES);
});



// Watch
gulp.task('watch', function() {

  


  gulp.watch(srcPath.HTML, ['html']);
  gulp.watch(srcPath.PARTIALS, ['partials']);
  // Watch .scss files
  gulp.watch(srcPath.SCSS, ['styles']);

  // Watch .js files
  gulp.watch(srcPath.SCRIPTS, ['scripts']);

  // Watch image files
  gulp.watch(srcPath.IMAGES, ['images']);
  watch(destPath.DEST_FILES).pipe(connect.reload());
  // Create LiveReload server
  // livereload.listen();

  // Watch any files in dist/, reload on change
  // gulp.watch([destPath.DEST_FILES]).on('change', livereload.changed);
});

gulp.task('build', function(){
});

gulp.task('replaceHTML', function(){
  gulp.src(srcPath.HTML)
    .pipe(htmlreplace({
      'js': destPath.BUILD + destPath.MINIFIED_OUT
    }))
    .pipe(gulp.dest(destPath.DEST));
});
// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'bower', 'images', 'html', 'scripts', 'partials', 'webserver','watch'); //, 'scripts'
});
gulp.task('production', ['replaceHTML', 'build']);