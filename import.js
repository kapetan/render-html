(function() {
	var scripts = document.getElementsByTagName('script');
	var src = scripts[scripts.length - 1].src;

	var a = document.createElement('a');
	a.href = src;

	var host = a.host;
	var protocol = a.protocol;
	a = null;

	var base =  protocol + '//' + host;

	document.write('<meta name="render-html-host" content="' + host + '">');
	document.write('<script type="text/javascript" src="' + base + '/bower_components/platform/platform.js"></script>');
	document.write('<link rel="import" href="' + base + '/dist/render-html.html">');
}());
