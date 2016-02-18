var gulp = require('gulp'),
	connect = require('gulp-connect'),
	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	htmlreplace = require('gulp-html-replace');

var distDir = './build/',
    sourceDir = './src/';

gulp.task('webserver', function() {
	connect.server({
		root: distDir,
		port: 2345,
		livereload: true
	});
	gulp.watch('src/**/*.*', ['build', 'images', 'styles', 'vendor']);
});

gulp.task('images', function() {
	gulp.src(sourceDir + '**/*.{jpg,png,gif}')
		.pipe(gulp.dest(distDir));
});

gulp.task('styles', function() {
	gulp.src(sourceDir + '**/*.css')
		.pipe(gulp.dest(distDir));
});

gulp.task('build', function() {
	gulp.src([sourceDir + '**/utility.js', sourceDir + '**/game_events.js', sourceDir + '**/*.js'])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(distDir))
		.pipe(connect.reload());
});

gulp.task('vendor', function() {
	gulp.src(sourceDir + '**/*.html')
		.pipe(htmlreplace({
			'vendor': 'vendor.js',
			'js': 'main.js'
		}))
		.pipe(gulp.dest(distDir));
});

gulp.task('lint', function() {
	gulp.src(sourceDir + '**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
});

// gulp.task('lint', function() {
// 	gulp.src(sourceDir + '**/*.js')
// 		.pipe(eslint())
// 		.pipe(eslint.format())
// 		.pipe(eslint.failAfterError());
// });

gulp.task('default', ['build', 'images', 'styles', 'vendor']);