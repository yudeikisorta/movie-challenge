var gulp = require('gulp');

var connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort');

var config = {
    assetsDir: 'src/assets/',
    bowerDir: 'bower_components',
    publicDir : 'dist/'
};

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest(config.publicDir + 'fonts'));
});

gulp.task('views', function() {
    return gulp.src('src/views/partials/**.*')
        .pipe(gulp.dest(config.publicDir + 'partials'));
});

gulp.task('stylesheets', ['icons'], function() {
    return gulp.src(config.assetsDir + 'sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.publicDir + 'stylesheets/'));
});

gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('scripts', ['lint'], function() {
    return gulp.src('src/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('bower-css', function() {
     return gulp.src([
            'bower_components/select2/select2.css',
            'bower_components/angular-input-stars-directive/angular-input-stars.css',
            'bower_components/angularjs-datepicker/src/css/angular-datepicker.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(config.publicDir + 'stylesheets/'))
});

gulp.task('bower-js', function() {
    return gulp.src([
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/select2/select2.js',
            './bower_components/angular/angular.min.js',
            './bower_components/angular-route/angular-route.min.js',
            './bower_components/angular-ui-select2/src/select2.js',
            './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            './bower_components/bootbox/bootbox.js',
            './bower_components/ngBootbox/dist/ngBootbox.min.js',
            './bower_components/angularjs-datepicker/src/js/angular-datepicker.js',
            './bower_components/angular-input-stars-directive/angular-input-stars.js',
            './bower_components/angular-websql/angular-websql.min.js',
            './bower_components/angularUtils-pagination/dirPagination.js',
            './bower_components/angular-base64-upload/src/angular-base64-upload.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('html', ['views','stylesheets', 'scripts', 'bower-js', 'bower-css'], function(){
    var injectFiles = gulp.src([config.publicDir + 'stylesheets/*.css']);
    var injectJs = gulp.src([config.publicDir + 'js/*.js']).pipe(angularFilesort());

    var injectOptions = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    return gulp.src('src/views/index.html')
        .pipe(inject(injectFiles, injectOptions))
        .pipe(inject(injectJs, injectOptions))
        .pipe(gulp.dest(config.publicDir));
});

gulp.task('sass', function() {
    return gulp.src('src/assets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/assets/sass'));
});

gulp.task('default', ['html']);



gulp.task('watchDev', function() {
    gulp.watch('src/assets/**/*.scss',['sass']);
});

gulp.task('connectDev', ['sass', 'watchDev'], function () {
    connect.server({
        port: 8000,
        livereload: true
    });
});

gulp.task('connect', function () {
    connect.server({
        root: 'dist/',
        port: 8002,
        livereload: true
    });
});
