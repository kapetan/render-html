# render-html

A small web component for rendering HTML as images. It depends on a server for converting the HTML. The development server is written in Node.js, and uses [phantom-render-stream][prs] to create the images.

# Usage

Render HTML using the `src` attribute

```html
<render-html src="http://googl.com">
```

Render HTML contained in the tags

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

Attributes `width`, `height` and `format` are also available. They are passed to `phantom-render-stream` as options.

[prs]: https://github.com/e-conomic/phantom-render-stream "phantom-render-stream"
