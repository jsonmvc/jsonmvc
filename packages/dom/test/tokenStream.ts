import { TokenStreamClass } from './../src/compiler/TokenStream';
import { InputStreamClass } from './../src/compiler/InputStream';
import { ElementClass } from './../src/compiler/Element';

function getTokens(template) {
  const input = new InputStreamClass(template);
  const stream = new TokenStreamClass(input);
  return stream.run();
}

it('should tokenize a single element', () => {
  const tpl = new ElementClass({
    indent: 2,
    tag: { value: 'div' },
    classes: [{ value: 'foo' }, { value: 'bar' }],
    id: { value: 'bam' },
    content: { value: 'Test' },
    attributes: [
      {
        name: 'attribute-test',
        value: '123foobar\\"',
      },
    ],
  });
  const tokens = getTokens(tpl.toString());
  expect(tokens).toEqual(tpl.toTokens());
});

it('should tokenize a component', () => {
  const comp = [
    new ElementClass({
      indent: 2,
      tag: { value: 'div' },
      classes: [{ value: 'foo' }, { value: 'bar' }],
      id: { value: 'bam' },
      content: { value: 'Test' },
      attributes: [
        {
          name: 'attribute-test',
          value: '123foobar\\"',
        },
      ],
    }),
    new ElementClass({
      indent: 0,
      tag: { value: 'div' },
      classes: [{ value: 'foo' }, { value: 'bar' }],
      id: { value: 'bam' },
      content: { value: 'Test' },
      attributes: [
        {
          name: 'attribute-test',
          value: '123foobar\\"',
        },
      ],
    }),
  ];

  const tpl = comp.map(x => x.toString()).join('\n');
  const compTokens = comp.map(x => x.toTokens()).reduce((acc, x) => acc.concat(x), []);
  const tokens = getTokens(tpl);
  expect(tokens).toEqual(compTokens);
});

it('should throw due to unclosing attribute', () => {
  expect(() => {
    getTokens(`div(foo="bla)`);
  }).toThrow();
});

// div
//  |[add /foo/bar 123]
//  |[mouseenter: remove /bar]
//  |[mouseleave: add /boo/{{ boo }} "asd" + {{ foo }}] Foo Bar

it('should recognize pipes', () => {
  const tokens = getTokens(`div
  |.foo
  |#bar
  |(
  |bam="boo"
  |) baz`);
  expect(tokens).toEqual([
    { type: 'newLineIndent', value: 0 },
    { type: 'tag', value: 'div' },
    { type: 'newLineIndent', value: 2 },
    { type: 'pipe' },
    { type: 'class', value: 'foo' },
    { type: 'newLineIndent', value: 2 },
    { type: 'pipe' },
    { type: 'id', value: 'bar' },
    { type: 'newLineIndent', value: 2 },
    { type: 'pipe' },
    { type: 'attribute', value: { name: 'bam', value: 'boo' } },
    { type: 'newLineIndent', value: 2 },
    { type: 'pipe' },
    { type: 'content', value: 'baz' },
  ]);
});
