const TokenStream = require("./../src/compiler/tokenStream");
const InputStream = require("./../src/compiler/inputStream");
const ElementTemplate = require("./../src/compiler/elementTemplate");

function getTokens(template) {
  const input = new InputStream(template);
  const stream = new TokenStream(input);
  return stream.run();
}

it("should tokenize a single element", () => {
  const tpl = new ElementTemplate([
    {
      indent: 2,
      tag: { value: "div" },
      classes: [{ value: "foo" }, { value: "bar" }],
      id: { value: "bam" },
      content: { value: "Test" },
      attributes: [
        {
          name: "attribute-test",
          value: '123foobar\\"'
        }
      ]
    }
  ]);
  const tokens = getTokens(tpl.toString());
  expect(tokens).toEqual(tpl.toTokens());
});
