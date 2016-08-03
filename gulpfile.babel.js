import gulp from 'gulp';
import express from 'express';
import useref from 'gulp-useref';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';

gulp.task('serve:dev', ['watch'], () => {

});

gulp.task('watch', () => {
	gulp.watch('src/stylesheets/sass/*.scss', ['sass']);
	gulp.watch('src/js/*.js', ['babel']);
});

gulp.task('serve', ['build-site'], () => {
	let server = express();

	server.use(express.static('dist'));

	server.listen(3000);
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

gulp.task('useref', ['sass', 'babel'], () => {
	gulp.src('src/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))

		.pipe(gulp.dest('dist'));
});

