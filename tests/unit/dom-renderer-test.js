/* global QUnit */

const { test } = QUnit;

import Renderer from 'mobiledoc-html-renderer';

let renderer;
QUnit.module('Unit: Mobiledoc HTML Renderer', {
  beforeEach() {
    renderer = new Renderer();
  }
});

test('it exists', (assert) => {
  assert.ok(Renderer, 'class exists');
  assert.ok(renderer, 'instance exists');
});

test('renders an empty mobiledoc', (assert) => {
  let mobiledoc = [
    [], // markers
    []  // sections
  ];
  let rendered = renderer.render(mobiledoc);

  assert.ok(rendered, 'renders output');
  assert.equal(rendered, '<div></div>', 'output is empty');
});

test('renders a mobiledoc without markers', (assert) => {
  let mobiledoc = [
    [], // markers
    [   // sections
      [1, 'P', [
        [[], 0, 'hello world']]
      ]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered,
               '<div><p>hello world</p></div>');
});

test('renders a mobiledoc with simple (no attributes) marker', (assert) => {
  let mobiledoc = [
    [        // markers
      ['B'],
    ],
    [        // sections
      [1, 'P', [
        [[0], 1, 'hello world']]
      ]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><b>hello world</b></p></div>');
});

test('renders a mobiledoc with complex (has attributes) marker', (assert) => {
  let mobiledoc = [
    [        // markers
      ['A', ['href', 'http://google.com']],
    ],
    [        // sections
      [1, 'P', [
          [[0], 1, 'hello world']
      ]]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><a href="http://google.com">hello world</a></p></div>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let mobiledoc = [
    [        // markers
      ['B'],
      ['I']
    ],
    [        // sections
      [1, 'P', [
        [[0], 0, 'hello '], // b
        [[1], 0, 'brave '], // b+i
        [[], 1, 'new '], // close i
        [[], 1, 'world'] // close b
      ]]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><b>hello <i>brave new </i>world</b></p></div>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let url = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
  let mobiledoc = [
    [],      // markers
    [        // sections
      [2, url]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, `<div><img src="${url}"></div>`);
});

test('renders a mobiledoc with card section and src in payload to image', (assert) => {
  assert.expect(1);
  let cardName = 'title-card';
  let payload = {
    src: 'bob.gif'
  };
  let mobiledoc = [
    [],      // markers
    [        // sections
      [10, cardName, payload]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><img src="bob.gif"></div>');
});

test('renders a mobiledoc with card section and no src to nothing', (assert) => {
  assert.expect(1);
  let cardName = 'title-card';
  let payload = {
    name: 'bob'
  };
  let mobiledoc = [
    [],      // markers
    [        // sections
      [10, cardName, payload]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p></p></div>');
});
