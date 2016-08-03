import gulp from 'gulp';
import express from 'express';
import useref from 'gulp-useref';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';

var _browserSync = browserSync.create();

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

gulp.task('babel', () => {
	gulp.src('src/js/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('useref:dev', ['sass', 'babel'], () => {
	gulp.src('src/index.html')
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('useref', ['sass', 'babel'], () => {
	gulp.src('src/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});
