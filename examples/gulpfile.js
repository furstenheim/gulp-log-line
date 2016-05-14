var gulp = require('gulp');
var logLiner = require('../index.js');
gulp.task('line-log', function() {
    return gulp.src("file.js", {buffer : true})
        .pipe(logLiner(['console.log']))
        .pipe(gulp.dest('./build'))

})

gulp.task('default', ['line-log'])