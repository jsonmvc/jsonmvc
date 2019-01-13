const TokenStream = require("./../src/compiler/tokenStream");
const InputStream = require("./../src/compiler/inputStream");

function getTokens(template) {
  const input = new InputStream(template);
  const stream = new TokenStream(input);
  return stream.run();
}

class Template {
  constructor(tpl) {
    this.tpl = tpl;
  }
  toString() {
    return this.tpl.reduce((acc, x) => {
      let str = "";
      if (x.indent) {
        while (x.indent > 0) {
          str += " ";
          x.indent -= 1;
        }
      }
      if (x.tag) {
        str += x.tag;
      }
      if (x.id) {
        str += `#${x.id}`;
      }
      if (x.classes) {
        str += `.${x.classes.join(".")}`;
      }
      if (x.attributes) {
        str += "(";
        str += x.attributes.map(x => `${x.name}="${x.value}"`).join(" ");
        str += ")";
      }
      if ((x.tag || x.classes || x.id || x.attributes) && x.content) {
        str += " ";
      }
      if (x.content) {
        str += x.content;
      }
      acc += str;
      return acc;
    }, "");
  }
  toJest() {}
}

it("should pass a basic test", () => {
  const tpl = new Template([
    {
      indent: 2,
      tag: "div",
      classes: ["foo", "bar"],
      id: "bam",
      content: "Test",
      attributes: [
        {
          name: "style",
          value: "background: red;"
        }
      ]
    }
  ]);
  const tokens = getTokens(tpl.toString());
  console.log(tpl.toString());
});

/*
// TODO: Create a composer function for elements and base the test suit based on the output
// TODO: Define a token format to generate easier both the structure and the test case

it("should find tags", () => {
  const tokens = getTokens(`div Test`);
  console.log(tokens);
  expect(tokens).toEqual([
    {
      type: "tag",
      value: "div"
    },
    {
      type: "content",
      value: "Test"
    }
  ]);
});

it("should find classes", () => {
  const tokens = getTokens(`.foo Test`);
  console.log(tokens);
  expect(tokens).toEqual([
    {
      type: "cssClass",
      value: "foo"
    },
    {
      type: "content",
      value: "Test"
    }
  ]);
});

it("should find attributes", () => {
  const tokens = getTokens(`div(style="background: red;") Test`);
  console.log(tokens);
  expect(tokens).toEqual([
    {
      type: "tag",
      value: "div"
    },
    {
      type: "attribute",
      value: "background: red"
    },
    {
      type: "content",
      value: "Test"
    }
  ]);
});

it("should find ids", () => {
  const tokens = getTokens(`#foo Test`);
  console.log(tokens);
  expect(tokens).toEqual([
    {
      type: "cssId",
      value: "foo"
    },
    {
      type: "content",
      value: "Test"
    }
  ]);
});
*/
