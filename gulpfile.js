var fs = require('fs');
var gulp = require('gulp');
var sequence = require('run-sequence');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var footer = require('gulp-footer');
var templateCache = require('gulp-angular-templatecache');
var less = require('gulp-less');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var webserver = require('gulp-webserver');

var config = {
	pkg: JSON.parse(fs.readFileSync('./package.json')),
	banner: '/*!\n' +
		' * <%= pkg.name %>\n' +
		' * @version: <%= pkg.version %> - <%= timestamp %>\n' +
		' * @author: <%= pkg.author %>\n' +
		' * @license: <%= pkg.license %>\n' +
		' */\n\n\n'
};

gulp.task('default', ['build']);
gulp.task('build', ['clean', 'build-scripts', 'build-styles']);

gulp.task('watch', ['webserver'], function () {
	return gulp.watch(['src/**/*.{js,less,html}'], ['build']);
});

gulp.task('webserver', function () {
	return gulp.src('./')
		.pipe(webserver({
			directoryListing: true
		}));
});

gulp.task('clean', function () {
	return gulp.src('dist', {
			read: false
		})
		.pipe(clean({
			force: true
		}));
});

gulp.task('build-scripts', function (cb) {
	return sequence('templates', 'scripts', cb);
});

gulp.task('scripts', function () {
	return gulp.src(['src/js/common.js', 'src/js/controllers/*.js', 'src/js/services/*.js', 'src/js/directives/*.js', 'src/js/templates.js'])
		.pipe(plumber({
			errorHandler: handleError
		}))
		.pipe(concat('angular-grid-table.js'))
		.pipe(header('(function () {\n\t\'use strict\';\n'))
		.pipe(header(config.banner, {
			pkg: config.pkg,
			timestamp: new Date().toISOString()
		}))
		.pipe(footer('\n}());'))
		.pipe(gulp.dest('dist'))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean-templates', function () {
	return gulp.src('src/js/templates.js', {
			read: false
		})
		.pipe(clean({
			force: true
		}));
});

gulp.task('templates', ['clean-templates'], function () {
	return gulp.src('src/html/**/*.html')
		.pipe(minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		}))
		.pipe(templateCache({
			module: 'grid',
			templateHeader: 'grid.run(["$templateCache", function($templateCache) {\n',
			templateFooter: '\n}]);'
		}))
		.pipe(gulp.dest('src/js'));
});

gulp.task('build-styles', function (cb) {
	return sequence('less', 'styles', cb);
});

gulp.task('clean-css', function () {
	return gulp.src('src/css/*.css', {
			read: false
		})
		.pipe(clean({
			force: true
		}));
});

gulp.task('less', ['clean-css'], function () {
	return gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(gulp.dest('src/css'));
});

gulp.task('styles', function () {
	return gulp.src('src/css/*.css')
		.pipe(concat('angular-grid-table.css'))
		.pipe(header(config.banner, {
			pkg: config.pkg,
			timestamp: new Date().toISOString()
		}))
		.pipe(gulp.dest('dist'))
		.pipe(minifyCss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('dist'));
});

var handleError = function (err) {
	console.log(err.toString());
	this.emit('end');
};