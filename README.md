#Gulp log-line

[![Build Status](https://travis-ci.org/furstenheim/gulp-log-line.svg?branch=master)](https://travis-ci.org/furstenheim/gulp-log-line)

Log file and line number without the extra cost of reading the stack.

## Usage
```
var gulp = require('gulp');
var logLine = require('gulp-log-line');
gulp.task('line-log', function() {
    return gulp.src("file.js", {buffer : true})
    //Write here the loggers you use.
        .pipe(logLine(['console.log', 'winston.info']))
        .pipe(gulp.dest('./build'))

})

gulp.task('default', ['line-log'])
```

## Example

file.js
```
console.log('First log')
var someVariable
console.log('Second log')
```

Becomes

file.js
```
console.log('file.js:1', 'First log')
var someVariable
console.log('file.js:3', 'Second log')
```