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
  /**
   * Get a list of all the characters until a targeted one
   * @param ch character to search
   * @returns array
   */
  peekUntil(ch) {
    let pos = this.pos;
    let chs: string[] = [];
    let newCh;
    do {
      newCh = this.input.charAt(pos);
      if (newCh !== ch) {
        chs.push(newCh);
      }
      pos += 1;
    } while (newCh !== ch && ch !== '');
    return chs;
  }
  // start of file
  sof(): boolean {
    return this.line === 1 && this.col === 1;
  }
  eof(): boolean {
    return this.peek() == '';
  }
  error(msg) {
    throw new Error(msg + ' (' + this.line + ':' + this.col + ')');
  }
}
