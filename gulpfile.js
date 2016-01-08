var gulp = require('gulp'),
	connect = require('gulp-connect');

gulp.task('default', function() {
	connect.server({
		root: 'src',
		port: 2345,
		livereload: true
	});
});