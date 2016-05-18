var logLine = require('../index.js')
var fs = require('fs')
var gulp = require('gulp')
var should = require('should')
var concatStream = require('concat-stream')

describe('gulp-log-line', function() {
    "use strict"
    var fileNames = [{name : 'file.js', description : 'First test'}, {name : 'file2.js', description : 'Sanitize regular expressions'}, {name : 'file3.js', description : 'replace all occurences on one line'}]
    for (let fileName of fileNames) {
        let originalFilePath = 'test/original/' + fileName.name
        let expectedFilePath = 'test/expected/' + fileName.name
        describe('buffered input ' + fileName.description, function()  {
            var file, check;
            beforeEach(function() {
                file = gulp.src(originalFilePath)
                check = function(stream, done, callback) {
                    stream.on('data', function(newFile) {
                        callback(newFile)
                        done()
                    })
                    file.pipe(stream)
                }
            })
            it('Should work with function name as string', function(done) {
                var stream = logLine(['console.log'])
                check(stream, done, function (newFile) {
                    String(newFile.contents).should.equal(fs.readFileSync(expectedFilePath, 'utf8').toString())
                })
            })


        })

        describe('Streamed input ' + fileName.description, function() {
            var file, check;

            beforeEach(function() {
                file = gulp.src(originalFilePath, {buffer : false})
                check = function(stream, done, callback) {
                    stream.on('data', function(newFile) {
                        newFile.contents.pipe(concatStream({encoding : 'string'}, function(data){
                            callback(data)
                            done()
                        }))
                    })
                    file.pipe(stream)
                }
            })
            it('Should work with function name as string', function(done) {
                var stream = logLine(['console.log'])
                check(stream, done, function (newFile) {
                    newFile.should.equal(fs.readFileSync(expectedFilePath, 'utf8').toString())
                })
            })
        })
    }

})