const TemplateInterface = {
  indent: 2,
  tag: {
    value: "div"
  },
  classes: [
    {
      value: "foo"
    },
    {
      value: "bar"
    }
  ],
  id: {
    value: "bam"
  },
  content: { value: "Test" },
  attributes: [
    {
      name: "style",
      value: "background: red;"
    }
  ]
};

// TODO: Export token types as constants
module.exports = class ElementTemplate {
  constructor(tpl) {
    this.tpl = tpl;
  }
  toString() {
    let tpl = JSON.parse(JSON.stringify(this.tpl));
    return tpl.reduce((acc, x) => {
      let str = "";
      if (x.indent) {
        while (x.indent > 0) {
          str += " ";
          x.indent -= 1;
        }
      }
      if (x.tag) {
        str += x.tag.value;
      }
      if (x.id) {
        str += `#${x.id.value}`;
      }
      if (x.classes) {
        str += x.classes.reduce((acc, x) => {
          acc += `.${x.value}`;
          return acc;
        }, "");
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
        str += x.content.value;
      }
      acc += str;
      return acc;
    }, "");
  }
  toTokens() {
    let tpl = JSON.parse(JSON.stringify(this.tpl));
    return tpl.reduce((acc, x) => {
      let tokens = [];
      if (x.indent) {
        tokens.push({
          type: "newLineIndent",
          value: x.indent
        });
      }
      if (x.tag) {
        tokens.push({
          type: "tag",
          value: x.tag.value
        });
      }
      if (x.id) {
        tokens.push({
          type: "id",
          value: x.id.value
        });
      }
      if (x.classes) {
        tokens = tokens.concat(
          x.classes.map(x => ({
            type: "class",
            value: x.value
          }))
        );
      }
      if (x.attributes) {
        tokens = tokens.concat(
          x.attributes.map(x => ({
            type: "attribute",
            value: {
              name: x.name,
              value: x.value
            }
          }))
        );
      }
      if (x.content) {
        tokens.push({
          type: "content",
          value: x.content.value
        });
      }
      acc = acc.concat(tokens);
      return acc;
    }, []);
  }
};
