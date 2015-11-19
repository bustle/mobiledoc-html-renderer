/* global QUnit */

const { test } = QUnit;

import Renderer from 'mobiledoc-html-renderer';
const MOBILEDOC_VERSION = '0.2.0';
import ImageCard from 'mobiledoc-html-renderer/cards/image';

const dataUri = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

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

test('throws when given invalid card type', (assert) => {
  let card = {
    name: 'bad',
    type: 'other',
    render() {}
  };
  assert.throws(
    () => { new Renderer({cards:[card]}) }, // jshint ignore:line
    /Card "bad" must be of type "html"/);
});

test('throws when given card without `render`', (assert) => {
  let card = {
    name: 'bad',
    type: 'html',
    render: undefined
  };
  assert.throws(
    () => { new Renderer({cards:[card]}) }, // jshint ignore:line
    /Card "bad" must define.*render/);
});

test('throws if card renders invalid response', (assert) => {
  let card = {
    name: 'bad',
    type: 'html',
    render() {
      return Object.create(null);
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [[10, card.name]]  // sections
    ]
  };
  renderer = new Renderer({cards: [card]});
  assert.throws(
    () => renderer.render(mobiledoc),
    /Card "bad" must render html/
  );
});

test('teardown hook calls registered teardown methods', (assert) => {
  let didTeardown;
  let card = {
    name: 'hasteardown',
    type: 'html',
    render({env}) {
      env.onTeardown(() => didTeardown = true);
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [[10, card.name]]  // sections
    ]
  };
  renderer = new Renderer({cards: [card]});
  let { teardown } = renderer.render(mobiledoc);

  assert.ok(!didTeardown, 'precond - no teardown yet');

  teardown();

  assert.ok(didTeardown, 'teardown hook called');
});

test('renders an empty mobiledoc', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      []  // sections
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);

  assert.ok(rendered, 'renders output');
  assert.equal(rendered, '<div></div>', 'output is empty');
});

test('renders a mobiledoc without markers', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [1, 'P', [
          [[], 0, 'hello world']]
        ]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered,
               '<div><p>hello world</p></div>');
});

test('renders a mobiledoc with simple (no attributes) marker', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['B'],
      ],
      [        // sections
        [1, 'P', [
          [[0], 1, 'hello world']]
        ]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><b>hello world</b></p></div>');
});

test('renders a mobiledoc with complex (has attributes) marker', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['A', ['href', 'http://google.com']],
      ],
      [        // sections
        [1, 'P', [
            [[0], 1, 'hello world']
        ]]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><a href="http://google.com">hello world</a></p></div>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
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
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><b>hello <i>brave new </i>world</b></p></div>');
});

test('renders a mobiledoc with img section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [2, dataUri]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, `<div><img src="${dataUri}"></div>`);
});

test('renders unknown card with unknownCardHandler', (assert) => {
  assert.expect(5);

  let cardName = 'missing-card';
  let expectedPayload = {};
  let cardOptions = {};
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, expectedPayload]
      ]
    ]
  };
  let unknownCardHandler = ({env, payload, options}) => {
    assert.equal(env.name, cardName, 'correct name');
    assert.ok(!env.isInEditor, 'correct isInEditor');
    assert.ok(!!env.onTeardown, 'onTeardown hook exists');

    assert.deepEqual(payload, expectedPayload, 'correct payload');
    assert.deepEqual(options, cardOptions, 'correct options');
  };
  renderer = new Renderer({cards: [], unknownCardHandler, cardOptions});
  renderer.render(mobiledoc);
});

test('throws when encountering unknown card and no unknownCardHandler', (assert) => {
  let cardName = 'missing-card';
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName]
      ]
    ]
  };
  renderer = new Renderer({cards: [], unknownCardHandler: undefined});

  assert.throws(
    () => renderer.render(mobiledoc),
    /Card "missing-card" not found.*no unknownCardHandler/
  );
});

test('renders a mobiledoc with a card', (assert) => {
  assert.expect(6);

  let cardName = 'title-card';
  let expectedPayload = {};
  let expectedOptions = {};
  let titleCard = {
    name: cardName,
    type: 'html',
    render: ({env, payload, options}) => {
      assert.deepEqual(payload, expectedPayload, 'correct payload');
      assert.deepEqual(options, expectedOptions, 'correct options');
      assert.equal(env.name, cardName, 'correct name');
      assert.ok(!env.isInEditor, 'isInEditor correct');
      assert.ok(!!env.onTeardown, 'has onTeardown hook');

      return 'Howdy friend';
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, expectedPayload]
      ]
    ]
  };
  renderer = new Renderer({cards: [titleCard], cardOptions: expectedOptions});
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><div>Howdy friend</div></div>');
});

test('renders a mobiledoc with built-in image card', (assert) => {
  assert.expect(1);
  let cardName = ImageCard.name;
  let payload = { src: dataUri };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);

  assert.equal(rendered, `<div><div><img src="${dataUri}"></div></div>`);
});

test('render mobiledoc with list section and list items', (assert) => {
  const mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [3, 'ul', [
          [[[], 0, 'first item']],
          [[[], 0, 'second item']]
        ]]
      ]
    ]
  };
  const { result: rendered } = renderer.render(mobiledoc);

  assert.equal(rendered,
               '<div><ul><li>first item</li><li>second item</li></ul></div>');
});

test('render mobiledoc with multiple spaces into &nbsp;s to preserve whitespace', (assert) => {
  let space = ' ';
  let repeat = (str, count) => {
    let result = '';
    while (count--) {
      result += str;
    }
    return result;
  };
  let text = [
    repeat(space, 4), 'some',
    repeat(space, 5), 'text',
    repeat(space, 6)
  ].join('');
  const mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [1, 'p', [
          [[], 0, text]
        ]]
      ]
    ]
  };
  const { result: rendered } = renderer.render(mobiledoc);

  let sn = ' &nbsp;';
  let expectedText = [
    repeat(sn, 2), 'some',
    repeat(sn, 2), ' ', 'text',
    repeat(sn, 3)
  ].join('');
  assert.equal(rendered,
               `<div><p>${expectedText}</p></div>`);
});

test('throws when given an unexpected mobiledoc version', (assert) => {
  let mobiledoc = {
    version: '0.1.0',
    sections: [
      [], []
    ]
  };
  assert.throws(
    () => renderer.render(mobiledoc),
    /Unexpected Mobiledoc version.*0.1.0/);

  mobiledoc.version = '0.2.1';
  assert.throws(
    () => renderer.render(mobiledoc),
    /Unexpected Mobiledoc version.*0.2.1/);
});
