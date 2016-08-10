'use strict';

const del = require('del'),
	  gulp = require('gulp'),
	  gulpif = require('gulp-if'),
	  mergeStream = require('merge-stream'),
	  polymer = require('polymer-build'),
	  PolymerProject = polymer.PolymerProject,
	  fork = polymer.forkStream,
	  polymerJSON = require('./polymer.json'),
	  project = new PolymerProject(polymerJSON),
	  polyserve = require('polyserve'),
	  babel = require('gulp-babel');

gulp.task('clean', function() {
	return del('build');
});

gulp.task('build', ['clean'], function() {
	const sources = project.sources()
		.pipe(project.splitHtml())
		.pipe(gulpif(/\.js$/, babel({
			presets: ['es2015']
		})))
		.pipe(project.rejoinHtml());

	const dependencies = project.dependencies()
		.pipe(project.splitHtml())
		// Add uglify, etc here
		.pipe(project.rejoinHtml());

	const merged = mergeStream(sources, dependencies)
		.pipe(project.analyzer);

	const unbundled = fork(merged)
		.pipe(gulp.dest('build/unbundled'));

	const bundled = fork(merged)
				.pipe(project.bundler)
				.pipe(gulp.dest('build/bundled'));

	return mergeStream(bundled, unbundled);
});

gulp.task('serve', ['build'], function() {
	polyserve.startServer({
		root: __dirname + '/build/unbundled/'
	});
});

gulp.task('default', ['build']);
