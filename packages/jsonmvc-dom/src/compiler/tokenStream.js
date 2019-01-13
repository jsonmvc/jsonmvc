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
contentSeparator = /\s/
content = /./
*/

class TokenStream {
  constructor(input) {
    this.input = input;
    this.current = null;
    this.htmlTags = ["div"];

    this.matchTag = /[a-z0-9\-]/;
    this.matchCSSClass = /[a-zA-Z0-9]/;
    this.matchCSSId = /[a-zA-Z0-9]/;
  }

  next() {
    const tok = this.current;
    this.current = null;
    return tok || this.readNext();
  }
  peek() {
    return this.current || (this.current = this.readNext());
  }
  eof() {
    return this.peek() === null;
  }
  error() {}

  // If previous char was \n check for indent
  readNext() {
    this.readWhile(this.isEOL);
    if (this.input.eof()) return null;
    const ch = this.input.peek();
    if (
      (this.input.peekPrev() === "" || this.input.peekPrev() === "\n") &&
      this.isIndent(ch)
    ) {
      return this.readIndent();
    }
    if (this.isTagStart(ch)) {
      return this.readTag();
    }
    if (this.isClassStart(ch)) {
      return this.readClass();
    }
    if (this.isIdStart(ch)) {
      return this.readId();
    }
    if (this.isContentStart(ch)) {
      return this.readContent();
    }
    this.input.error(`Can't recognize char "${ch}"`);
  }
  readWhile(predicate) {
    let str = "";
    while (!this.input.eof() && predicate(this.input.peek())) {
      str += this.input.next();
    }
    return str;
  }

  isEOL(ch) {
    return ch === "\n";
  }
  isIndent(ch) {
    return /\s/.test(ch);
  }
  isIdStart(ch) {
    return ch === "#";
  }
  isTagStart(ch) {
    return /[a-z]/.test(ch);
  }
  isContentStart(ch) {
    return /\s/.test(ch);
  }
  isClassStart(ch) {
    return ch === ".";
  }
  readTag() {
    let tag = this.readWhile(x => this.matchTag.test(x));
    return {
      type: "tag",
      value: tag
    };
  }
  readContent() {
    // skip content separator
    this.input.next();
    let content = this.readWhile(x => x !== "\n");
    return {
      type: "content",
      value: content
    };
  }
  readId() {
    // skip id separator
    this.input.next();
    let id = this.readWhile(x => this.matchCSSId.test(x));
    return {
      type: "cssId",
      value: id
    };
  }
  readClass() {
    // skip class indicator
    this.input.next();
    let className = this.readWhile(x => this.matchCSSClass.test(x));
    return {
      type: "cssClass",
      value: className
    };
  }
  readIndent() {
    let indent = this.readWhile(x => this.isIndent(x));
    return {
      type: "newLineIndent",
      value: indent.length
    };
  }
  is_HTMLTag(x) {
    return this.htmlTags.indexOf(x) !== -1;
  }
}

module.exports = TokenStream;
