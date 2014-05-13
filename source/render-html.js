var qs = require('querystring');
var util = require('util');
var fs = require('fs');

var xhr = require('xhr');

var DOCUMENT = fs.readFileSync(__dirname + '/document.html', 'utf-8');

var toJSON = function(source, attributes) {
	return attributes.reduce(function(acc, name) {
		if(source[name]) acc[name] = source[name];
		return acc;
	}, {});
};

var formatUrl = function(url, query) {
	query = qs.stringify(query);

	if(!query) return url;
	return url + (/\?/.test(url) ? '&' : '?') + query;
};

Polymer('render-html', {
	width: 1280,
	height: 960,
	format: 'png',
	src: null,
	ready: function() {
		var query = toJSON(this, ['width', 'height', 'format']);

		if(this.src) {
			query.url = this.src;
			var url = formatUrl('/render', query);

			this.url = url;
			return;
		}

		var self = this;
		var content = this.innerHTML;

		content = util.format(DOCUMENT, content);

		xhr({
			method: 'POST',
			url: formatUrl('/render', query),
			body: content,
		}, function(err, response, url) {
			self.url = url;
		});
	}
});
