const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const injectPartials = require('gulp-inject-partials');

/*
	--Top level functions--
	gulp.task	-	Define Tasks
	gulp.src	-	Points to source files
	gulp.dest	-	Points to folder to output
	gulp.watch	-	Watch files and folders for changes
	*/

	var notifyInfo = {
		title: 'Gulp'
	};
	//icon: path.join(__dirname, 'gulp.png')

	//error notification settings for plumber
	var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,

		// icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};



// Copy html files
gulp.task('copyHtml', function(){
	gulp.src('source/*.html')
	.pipe(injectPartials({
		removeTags: true
	}))
	.pipe(gulp.dest('app'));
});

// Optimize Images
gulp.task('imageMin', function(){
    gulp.src(['source/images/*', 'source/images/**/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('app/images'))
});
// Copy Videos
gulp.task('copyVid', function(){
	gulp.src(['source/videos/*', 'source/videos/**/*'])
		.pipe(gulp.dest('app/videos'))
});
// Copy Fonts
gulp.task('copyFont', function(){
	gulp.src(['source/fonts/*', 'source/fonts/**/*'])
		.pipe(gulp.dest('app/fonts'))
});

//Minify JS
gulp.task('scripts', function(){
	gulp.src('source/js/*.js')
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(notify({
		message: 'Scripts task complete'
	}))
});

//Compile SCSS
gulp.task('scss', function(){
	gulp.src('source/scss/styles.scss')
	.pipe(sass()).on('error', sass.logError)
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
	.pipe(notify({
		message: 'Styles task complete'
	}))
});

gulp.task('serve', function(){

	browserSync.init({
		server: "./app"
	});

	gulp.watch(['source/js/*.js', 'source/js/**/*.js'], ['scripts']);
	gulp.watch(['source/images/*', 'source/images/**/*'], ['imageMin']);
	gulp.watch(['source/videos/*', 'source/videos/**/*'], ['copyVid']);
	gulp.watch(['source/fonts/*', 'source/fonts/**/*'], ['copyFont']);
    gulp.watch(['source/scss/*.scss', 'source/scss/**/*.scss'], ['scss']);
    gulp.watch(['source/*.html', 'source/partials/*.html'], ['copyHtml']).on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'copyHtml', 'imageMin', 'copyVid', 'copyFont', 'scripts']);