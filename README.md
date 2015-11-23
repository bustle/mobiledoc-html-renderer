## Mobiledoc HTML Renderer [![Build Status](https://travis-ci.org/bustlelabs/mobiledoc-html-renderer.svg?branch=master)](https://travis-ci.org/bustlelabs/mobiledoc-html-renderer)

This is an HTML renderer for the [Mobiledoc](https://github.com/bustlelabs/mobiledoc-kit/blob/master/MOBILEDOC.md) format used
by [Mobiledoc-Kit](https://github.com/bustlelabs/mobiledoc-kit).

The renderer is a small library intended for use in servers that are building
HTML documents. It may be of limited use inside browsers as well.

### Usage

```
var mobiledoc = {
  version: "0.2.0",
  sections: [
    [         // markers
      ['B']
    ],
    [         // sections
      [1, 'P', [ // array of markups
        // markup
        [
          [0],          // open markers (by index)
          0,            // close count
          'hello world'
        ]
      ]
    ]
  ]
};
var renderer = new HTMLRenderer({cards: []});
var rendered = renderer.render(mobiledoc);
console.log(rendererd.result); // "<div><p><b>hello world</b></p></div>"
```

### Tests

Command-line:

 * `npm test`

Or in the browser:

 * `broccoli serve`
 * visit http://localhost:4200/tests

### Releasing

* `npm version patch` or `minor` or `major`
* `npm run build`
* `git push bustle --tags`
* `npm publish`
