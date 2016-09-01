import gulp from 'gulp';
import express from 'express';
import useref from 'gulp-useref';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import gulpIf from 'gulp-if';

import browserSync from 'browser-sync';
import path from 'path';
import webpackStream from 'webpack-stream';

let _browserSync = browserSync.create();
let jsSourceRoot = path.join(process.env.PWD, 'src/js');

function serveStaticSite() {
	let server = express();

	server.use(express.static('dist'));

	server.listen(3000);
}

gulp.task('serve:dev', ['useref:dev'], () => {
	_browserSync.init({
		server: {
			baseDir: 'dist'
		},
		browser: []
	});

	gulp.start('watch');
});

gulp.task('browsersync-reload', ['useref:dev'], () => {
	_browserSync.reload();
});

gulp.task('serve', ['build-site'], serveStaticSite);

gulp.task('watch', () => {
	gulp.watch('src/stylesheets/sass/*.scss', ['browsersync-reload']);
	gulp.watch('src/js/*.js', ['browsersync-reload']);
	gulp.watch('src/game/*.html', ['templates']);
	gulp.watch('src/index.html', ['browsersync-reload']);
});

gulp.task('build-site', ['useref']);

gulp.task('sass', () => {
	// compile all SASS
	gulp.src('src/stylesheets/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css/'));

	// copy all CSS
	gulp.src('src/stylesheets/css/*.css')
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('pack-js', () => {
	let webpackOptions = {
		devtool: 'inline-source-map',
		module: {
			loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['babel-loader']
			},
			{
				test: /\.json$/,
				exclude: /node_modules|bower_components/,
				loaders: ['json']
			}
			]
		},
		output: { filename: 'main.pack.js' },
		resolve: { root: jsSourceRoot }
	};

	return gulp.src(path.join(jsSourceRoot, 'main.js'))
					   .pipe(webpackStream(webpackOptions))
					   .pipe(gulp.dest('./dist/js'));

});

gulp.task('templates', () => {
	gulp.src('src/game/*.html')
		.pipe(gulp.dest('dist/game'));

	gulp.start('browsersync-reload');
});

gulp.task('resources', () => {
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('useref:dev', ['sass', 'pack-js', 'templates', 'resources'], () => {
	gulp.src('src/index.html')
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('useref', ['sass', 'minify-js', 'templates', 'resources'], () => {
	gulp.src('src/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});
