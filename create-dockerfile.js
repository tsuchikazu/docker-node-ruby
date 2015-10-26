var readdirp = require('readdirp')
  , path = require('path')
  , es = require('event-stream');
var fs = require('fs')
var split = require('split')
var filter = require('stream-filter')

// print out all JavaScript files along with their size

function readRubyFile(files) {
  console.log(files)
}

var stream = readdirp({ root: 'ruby', depth: 1, fileFilter: 'Dockerfile' });
stream
  .pipe(es.mapSync((entry) => {
    var path = 'ruby/' + entry.path;
    var content = fs.readFileSync(path, 'utf-8')
    return {path: path, content: content}
  }))
  .pipe(es.map((entry, callback) => {
    split(entry.content)
      .pipe(filter( (data) => {
        return data.startsWith('FROM')
      }))
      .pipe(es.writeArray( (err, array) => {
        entry.content = array.join('¥n')
        callback(null, entry)
      }))
  }))
  .pipe(es.stringify())
  .pipe(es.writeArray( (err, array) => {
    readRubyFile(array)
  }))
  //.pipe(process.stdout)
console.log(hoge)
//es.merge([
//  fs.createReadStream('.gitmodules'),
//  fs.createReadStream('Dockerfile')
//]).pipe(process.stdout);
