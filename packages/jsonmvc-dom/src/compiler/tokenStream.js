// indent | tag | classes | id | attributeStart | (attributeName, attributeContent) | attributeEnd | textSeparator | textContent

// TODO: Add debug information for each token (line number, col number, etc)

// TODO: Don't fail on error but return an ERROR Token that will be used by the
// parser to create an error element which will show the developer in-dom
// both the error message and the erroring element without affecting the
// rest of the template

// TODO: Ensure that the tokenizer never gets into an infinite loop

// TODO: Define an error code index

// TODO: Allow comment block on the same line as content ` div // this will foobar `
// this only works if the first 2 chars in the content area are a slash - the user should
// escape them ` div \// this will be shown `

// TODO: Allow block comments /* ... */

// TODO: After | ignore all white spaces until content

// TODO: Tokenize the content if {{ }} is encountered:
// `div foo {{ bar }} baz` becomes:
// `div
//    span foo&nbsp; // preserving white space
//    span {{ bar }} // the content will be replaced entirely with dynamic content
//    span &nbsp;baz // keeping white space accordingly

class TokenStream {
  constructor(input) {
    this.input = input;
    this.current = null;
    this.htmlTags = ["div"];

    this.matchTag = /[a-z0-9\-]/;
    this.matchCSSClass = /[a-zA-Z0-9]/;
    this.matchCSSId = /[a-zA-Z0-9]/;
    this.matchAttributeName = /[a-z\-]/;
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
  run() {
    let tokens = [];
    while (!this.eof()) {
      tokens.push(this.next());
    }
    return tokens;
  }
  error() {}

  // If previous char was \n check for indent
  readNext() {
    this.readWhile(this.isEOL);
    if (this.input.eof()) return null;
    let ch = this.input.peek();
    if (this.isAttributesStart(ch)) {
      if (this.readingAttributes) {
        this.input.error(
          'Open attributes char "(" was found inside an attribute definion.'
        );
      }
      this.readingAttributes = true;
      this.input.next();
      ch = this.input.peek();
    }
    if (this.isAttributeEnd(ch)) {
      this.readingAttributes = false;
      this.input.next();
      ch = this.input.peek();
    }
    if (this.readingAttributes) {
      this.readWhile(this.isWhiteSpace);
      return this.readAttribute();
    }
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
  isWhiteSpace(ch) {
    return /\s/.test(ch);
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
  isAttributesStart(ch) {
    return ch === "(";
  }
  isAttributeEnd(ch) {
    return ch === ")";
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
    // TODO: Verify that the id is valid
    return {
      type: "id",
      value: id
    };
  }
  readClass() {
    // skip class indicator
    this.input.next();
    let className = this.readWhile(x => this.matchCSSClass.test(x));
    return {
      type: "class",
      value: className
    };
  }
  readAttribute() {
    let attributeName = this.readWhile(x => this.matchAttributeName.test(x));
    let ch = this.input.peek();
    let value;
    if (ch === "=") {
      this.input.next();
      ch = this.input.peek();
      if (ch !== '"') {
        input.error('Expecting " to begin attribute value');
      }
      // Remove the first quotes
      this.input.next();
      value = this.readWhile(x => {
        return x !== '"' || (x === '"' && this.input.peekPrev() === "\\");
      });
      // Remove the last quotes
      this.input.next();
    } else {
      value = null;
    }
    return {
      type: "attribute",
      value: {
        name: attributeName,
        value: value
      }
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
