module.exports = gulpLogLine;

var gutil = require('gulp-util');
var through = require('through2')
var split = require('split2')
var PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-log-line'
//TODO handle buffers nicely. To avoid overhead of decoding and encoding

/**
 *
 * @param {String[]|RegExp[]} loggers List of logger functions use. e.g '[winston.log, console.error..]'
 * Strings are replaced globally, regular expressions are replaced as provided
 */
function gulpLogLine(loggers) {
    var parsedLoggers = parseParams(loggers)
    return through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            return callback(null, file)
        }
        //TODO there should be a better way to find relative path
        var filePath = file.path.slice(file.base.length)
        if (file.isBuffer()) {
            file.contents = new Buffer(file.contents.toString().split('\n').map(function (line, lineNumber) {return replaceLine(line, lineNumber + 1, filePath, parsedLoggers)}).join('\n'))
        }
        if (file.isStream()) {
            file.contents = file.contents.pipe(split()).pipe(logLineStream(filePath, parsedLoggers))
        }
        callback(null, file)
    })
}

function logLineStream(filePath, loggers) {
    var lineNumber = 0;
    var stream = through(function(data, enc, done){
        lineNumber++;
        data = replaceLine(data.toString(), lineNumber, filePath, loggers)
        //We need to restore end line
        done(null, data + '\n')
        })
    return stream
}
function replaceLine(line, lineNumber, filePath, loggers) {
    loggers.forEach(function(logger) {
        line = line.replace(logger, function(expression) {
            return `${expression}'${filePath}:${lineNumber}',`
        })
    })
    return line;
}

/**
 * Parse array of strings and regular expressions to array of regular expressions, with each string set to global
 */
function parseParams(mArray) {
    return mArray.map(function (item) {
        if (item instanceof RegExp) {
            return item
        }
        if (typeof item === 'string') {
            return new RegExp(item + '\\(', 'g')
        }
        console.log(item)
        throw new PluginError(PLUGIN_NAME, 'Params must be strings or regexp')

    })
}