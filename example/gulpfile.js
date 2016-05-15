var gulp = require('gulp');
var logLine = require('../index.js');
gulp.task('log-line', function() {
    return gulp.src("file.js", {buffer : false})
        .pipe(logLine(['console.log']))
        .pipe(gulp.dest('./build'))

})

gulp.task('default', ['log-line'])