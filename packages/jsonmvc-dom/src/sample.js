let tokens = [
  { type: "tag", value: "div" },
  { type: "newLineIndent", value: 2 },
  { type: "tag", value: "div" },
  { type: "content", value: "Hello World" },
  { type: "newLineIndent", value: 2 },
  { type: "tag", value: "div" },
  { type: "id", value: "#foo" },
  { type: "class", value: ".bla" },
  { type: "attributeStart" },
  { type: "attribute", name: "style", value: "color: red;", expression: false },
  { type: "attribute", name: "class", value: "bam", expression: true },
  { type: "attributeEnd" },
  { type: "content", value: "Foo bar" },
  { type: "lineEnd" },
  { type: "newLineIndent", value: 4 },
  { type: "pipe" },
  { type: "content", value: "Baz bam" },
  { type: "newLineIndent", value: 2 },
  { type: "comment", value: "Foo bar baz" }
];

let ast = [
  {
    type: "element",
    tag: "div",
    class: ["bla"],
    id: "foo",
    attributes: {
      style: {
        expression: false,
        value: "color: red"
      },
      class: {
        expression: true,
        value: "`bam ${bam}`"
      }
    },
    content: {
      value: "Foo bar"
    }
  },
  {
    type: "comment",
    value: "Foo bar baz"
  }
];

// ast -> redom
