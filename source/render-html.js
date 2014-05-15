var qs = require('querystring');
var util = require('util');
var fs = require('fs');

var xhr = require('xhr');

var DOCUMENT = fs.readFileSync(__dirname + '/document.html', 'utf-8');

var noop = function() {};

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
	src: '',
	load: function(url) {
		if(this.image) {
			this.image.onerror = this.image.onload = noop;
		}

		var self = this;
		var root = this.shadowRoot;
		var image = this.image = new Image();

		image.onerror = function() {
			self.fire('error', new Error('Failed loading image'));
		};
		image.onload = function() {
			if(root.firstChild) root.removeChild(root.firstChild);
			root.appendChild(image);

			self.fire('load');
		};

		image.src = url;
	},
	renderHtml: function(html) {
		if(this._request) {
			this._request.abort();
		}

		html = html.innerHTML ? html.innerHTML : html;
		html = util.format(DOCUMENT, html);

		var self = this;
		var query = this._query();

		this._request = xhr({
			method: 'POST',
			url: formatUrl('/render', query),
			body: html,
		}, function(err, response, url) {
			if(err) return self.fire('error', err);
			self.load(url);
		});
	},
	renderSrc: function(src) {
		var query = this._query();
		query.url = src;

		var url = formatUrl('/render', query);

		this.load(url);
	},
	render: function() {
		if(this.src) this.renderSrc(this.src);
		else this.renderHtml(this.innerHTML);
	},
	ready: function() {
		this.onMutation(this, function rerender() {
			if(!this.src) this.renderHtml(this.innerHTML);
			this.onMutation(this, rerender);
		});

		this.render();
	},
	srcChanged: function() {
		this.render();
	},
	widthChanged: function() {
		this.render();
	},
	heightChanged: function() {
		this.render();
	},
	formatChanged: function() {
		this.render();
	},
	_query: function() {
		return toJSON(this, ['width', 'height', 'format']);
	}
});
