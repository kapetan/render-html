var util = require('util');
var os = require('os');
var path = require('path');
var fs = require('fs');
var qs = require('querystring');

var root = require('root');
var send = require('send');
var chokidar = require('chokidar');
var phantom = require('phantom-render-stream');

var build = require('./build');

var PORT = process.env.PORT || 10102;
var DIRECTORY = path.join(os.tmpdir(), 'render-html');

var app = root();
var render = phantom();

var mkdir = function() {
	try {
		fs.mkdirSync(DIRECTORY);
	} catch(err) {}
};

var watch = function() {
	chokidar.watch(path.join(__dirname, 'source')).on('change', function() {
		build(function(err) {
			if(err) throw err;
		});
	});
};

var filename = (function() {
	var counter = 0;

	return function(extension) {
		return util.format('%s_%s.%s', Date.now(), counter++, extension || 'bin');
	};
}());

app.use('request.absoluteUrl', function(path) {
	var https = this.connection.encrypted;
	var host = this.headers.host;

	if(!host) return path;
	return util.format('%s://%s%s', https ? 'https' : 'http', host, path);
});

app.use('request.image', { getter: true }, function() {
	var query = this.query;
	var image = {};

	if(query.width) image.width = parseInt(query.width, 10);
	if(query.height) image.height = parseInt(query.height, 10);
	if(query.format) image.format = query.format;

	image.mime = util.format('image/%s', image.format || 'jpeg');

	return image;
});

app.use('response.cors', function() {
	this.setHeader('Access-Control-Allow-Origin', '*');
	this.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	this.setHeader('Access-Control-Expose-Headers', 'Location, Date, Content-Length, Content-Type, ETag, Last-Modified');
});

app.all(function(request, response, next) {
	response.cors();

	if(request.method === 'OPTIONS') response.end();
	else next();
});

app.get('/render', function(request, response) {
	var image = request.image;
	var url = request.query.url;
	var data = request.query.data;

	if(data) {
		url = util.format('data:text/html;charset=utf-8,%s', encodeURIComponent(data));
	}

	response.setHeader('Content-Type', image.mime);
	render(url, image).pipe(response);
});

app.post('/render', function(request, response) {
	var name = filename('html');
	var file = path.join(DIRECTORY, name);

	request
		.pipe(fs.createWriteStream(file, { encoding: 'utf-8' }))
		.on('finish', function() {
			var url = request.absoluteUrl('/tmp/' + name);
			var image = request.image;

			delete image.mime;
			image.url = url;
			url = request.absoluteUrl('/render?' + qs.stringify(image));

			response.setHeader('Content-Type', 'plain/text; charset=utf-8');
			response.send(url);
		});
});

app.get('/tmp/{*}', function(request, response) {
	send(request, request.params.glob)
		.root(DIRECTORY)
		.pipe(response);
});

app.get('{*}', function(request, response) {
	send(request, request.params.glob)
		.root(__dirname)
		.pipe(response);
});

mkdir();
build(function(err) {
	if(err) throw err;
	watch();
});

app.listen(PORT, function() {
	console.log('Server listening on port ' + PORT);
});
