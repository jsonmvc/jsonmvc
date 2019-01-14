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
