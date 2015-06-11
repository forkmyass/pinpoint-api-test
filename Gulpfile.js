var gulp = require('gulp'),
    exec = require('child_process').exec,
    batch = require('gulp-batch'),
    watch = require('gulp-watch');
 
gulp.task('build', function (done) { 
    exec("browserify src/test/api.js -t [ babelify --stage 0] --outfile dist/test/api.js", (function(err, stdout, stdin) {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
        done()
    }));
});

gulp.task('watch', function () {
    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('build', done);
    }));
});

gulp.task("default", ["build", "watch"]);