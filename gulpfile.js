var gulp    = require('gulp');
var del     = require('del');
var concat  = require('gulp-concat');
var cssmin  = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var sass    = require('gulp-sass');
var maps    = require('gulp-sourcemaps');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var util    = require('gulp-util');

/* CLEAN TASKS */
gulp.task('clean', function(next) {
    return del(['./dist/**/*'], next);
});


/* BUILD TASKS */
gulp.task('build:img', function() {
    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('build:css', function() {
    return gulp.src('src/**/*.css')
        .pipe(maps.init())
        .pipe(concat('style.css').on('error', util.log))
        .pipe(cssmin())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build:scss', function() {
    return gulp.src('src/main.scss')
        .pipe(maps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename({
            dirname: '.',
            extname: '.min.css',
            basename: 'style'
        }))
        .pipe(gulp.dest('dist/'));
})

gulp.task('build:js', function(next) {
    return gulp.src(['src/app.js', 'src/**/*.js'])
            .pipe(maps.init())
            .pipe(concat('script.js').on('error', util.log))
            .pipe(uglify({ mangle: false }).on('error', util.log))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(maps.write())
            .pipe(gulp.dest('dist/'));
});

gulp.task('build:html', function() {
    return gulp.src('src/**/*.html')
            .pipe(htmlmin().on('error', util.log))
            .pipe(rename({ dirname: '.' }))
            .pipe(gulp.dest('dist/'))
});

gulp.task('build', ['build:html', 'build:scss', 'build:js', 'build:img']);


/* WATCH TASKS */
gulp.task('watch:img', ['build'], function() {
    return gulp.watch('src/img/**/*', ['build:img']);
});

gulp.task('watch:js', ['build'], function() {
    return gulp.watch('src/**/*.js', ['build:js']);
});

gulp.task('watch:css', ['build'], function() {
    return gulp.watch('src/**/*.css', ['build:css']);
});

gulp.task('watch:scss', ['build'], function() {
    return gulp.watch('src/**/*.scss', ['build:scss']);
});

gulp.task('watch:html', ['build'], function() {
    return gulp.watch('src/**/*.html', ['build:html']);
});

gulp.task('watch', ['watch:html', 'watch:scss', 'watch:js', 'watch:img']);;
