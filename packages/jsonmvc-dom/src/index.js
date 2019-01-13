const { Document } = require("nodom");
global.document = new Document();
const { el, list, mount } = require("redom");

global.document = new Document();

let template = `
  div Hello world
`;

// indent | tag | classes | id | attributeStart | (attributeName, attributeContent) | attributeEnd | textSeparator | textContent

/*
indent = /\s+/
tag = /^[a-z][a-zA-Z0-9]+$/
classes = /^\.[a-zA-Z0-9\-]+$/
id = /^#\.[a-zA-Z0-9\-]+$/
attributeStart = (
attributeEnd = )
attributeName= /^:?[a-z\-]+=\"/ 
attributeContent= /./
textSeparator = /\s/
textContent = /./
*/

class Li {
  constructor() {
    this.el = el("li");
  }
  update(data, index, items, context) {
    this.el.style.color = context.colors.accent;
    this.el.textContent = "[" + index + "] = Item " + data.title;
  }
}

const indent = " ";
const indentCode = indent.charCodeAt(0);

function processLine(str) {
  if (!str) {
    return;
  }
  let line = {
    indent: 0
  };

  let current = "space";

  for (let i = 0; i < str.length; i += 1) {
    const char = str[i];
    const charCode = char.charCodeAt(0);

    if (charCode === indentCode) {
      line.indent += 1;
    }
  }

  return line;
}

let rows = template
  .split("\n")
  .filter(x => !!x)
  .map(x => {
    let line = processLine(x);
    console.log(line);
    return {
      indent: 2,
      tag: "div",
      content: "Hello World",
      arguments: {}
    };
  });

console.log(rows);

let component = el("h1", "Foo bar");

mount(document.body, component);
console.log(document.body.outerHTML);
