export class InputStreamClass {
  input: string;
  pos: number = 0;
  line: number = 1;
  col: number = 1;
  constructor(input) {
    this.input = input;
  }

  next(): string {
    const ch = this.input.charAt(this.pos);
    this.pos += 1;
    if (ch == '\n') {
      this.line += 1;
      this.col = 0;
    } else {
      this.col += 1;
    }
    return ch;
  }
  peekPrev(): string {
    return this.input.charAt(this.pos - 1);
  }
  peek(): string {
    return this.input.charAt(this.pos);
  }
  eof(): boolean {
    return this.peek() == '';
  }
  error(msg) {
    throw new Error(msg + ' (' + this.line + ':' + this.col + ')');
  }
}
