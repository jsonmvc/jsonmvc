const ElementTemplate = require("./../src/compiler/elementTemplate");

it("should produce a valid template string", () => {
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
  expect(tpl.toString()).toEqual(
    `  div#bam.foo.bar(attribute-test="123foobar\\"") Test`
  );
});

it("should produce a valid token array", () => {
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
  expect(tpl.toTokens()).toEqual([
    { type: "newLineIndent", value: 2 },
    { type: "tag", value: "div" },
    { type: "id", value: "bam" },
    { type: "class", value: "foo" },
    { type: "class", value: "bar" },
    {
      type: "attribute",
      value: { name: "attribute-test", value: '123foobar\\"' }
    },
    { type: "content", value: "Test" }
  ]);
});
