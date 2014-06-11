# render-html

A small web component for rendering HTML as images. It depends on a server for converting the HTML. The development server is written in Node.js, and uses [phantom-render-stream][prs] to create the images.

The actual web component is written using [Polyer][polymer].

# Usage

Polymer dependencies are managed with `bower`, and are installed automatically together with the node modules. To view the `index.html` example run the following in a terminal.

	$ npm install
	$ node .

When running the server it's possible to include all the client-side dependencies using the `import.js` script. An easy way to render HTML is with the `src` attribute, which should be a valid URL.

```html
<!DOCTYPE html>
<html>
	<head>
		<title>render-html</title>
		<script type="text/javascript" src="http://localhost:10102/import.js"></script>
	</head>
	<body>
		<render-html src="http://google.com">
	</body>
</html>
```

It's also possible to render HTML contained in the tags.

```html
<render-html>
	<style type="text/css">
		#content {
			background: blue;
		}
	</style>

	<div id="content">
		<h1>Hello World!</h1>
		<p>Go here to see <a href="/">it</a>.</p>
	</div>
</render-html>
```

In addition to the `src` attribute, `width`, `height` and `format` are also available. They are passed to `phantom-render-stream` as options. The pdf format type isn't supported at the moment.

[prs]: https://github.com/e-conomic/phantom-render-stream "phantom-render-stream"
[polymer]: http://www.polymer-project.org "Polymer"
