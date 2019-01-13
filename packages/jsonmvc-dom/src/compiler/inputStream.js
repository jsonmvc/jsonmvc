module.exports = class InputStream {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
  }

  next() {
    const ch = this.input.charAt(this.pos);
    this.pos += 1;
    if (ch == "\n") {
      this.line += 1;
      this.col = 0;
    } else {
      this.col += 1;
    }
    return ch;
  }
  peekPrev() {
    return this.input.charAt(this.pos - 1);
  }
  peek() {
    return this.input.charAt(this.pos);
  }
  eof() {
    return this.peek() == "";
  }
  error(msg) {
    throw new Error(msg + " (" + this.line + ":" + this.col + ")");
  }
};
