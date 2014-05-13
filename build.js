var fs = require('fs');
var path = require('path');

var browserify = require('browserify');
var pump = require('pump');
var afterAll = require('after-all');

var source = function(name) {
	return path.join(__dirname, 'source', name);
};

var bundle = function(entry, destination, callback) {
	var name = path.basename(entry);
	var b = browserify();

	b.add(entry);
	b.transform('brfs');

	pump(
		b.bundle(),
		fs.createWriteStream(path.join(destination, name)),
		callback);
};

var copy = function(source, destination, callback) {
	var name = path.basename(source);

	pump(
		fs.createReadStream(source),
		fs.createWriteStream(path.join(destination, name)),
		callback);
};

module.exports = function(callback) {
	var destination = path.join(__dirname, 'dist');
	var next = afterAll(callback);

	bundle(source('render-html.js'), destination, next());
	copy(source('render-html.html'), destination, next());
};

if(require.main === module) {
	module.exports(function(err) {
		if(err) throw err;
	});
}
