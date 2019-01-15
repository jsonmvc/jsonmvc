import { TokenInterface } from './TokenStream';

export interface TagInterface {
  value: string;
}

export interface IdInterface {
  value: string;
}

export interface ContentInterface {
  value: string;
}
export interface ClassInterface {
  value: string;
}

export interface AttributeInterface {
  name: string;
  value: string;
}

export interface ElementInterface {
  indent: number;
  tag: TagInterface;
  id: IdInterface;
  classes: ClassInterface[];
  content: ContentInterface;
  attributes: AttributeInterface[];
}

export class ElementClass {
  tpl: ElementInterface;

  constructor(tpl: ElementInterface) {
    this.tpl = tpl;
  }
  toString(): string {
    let x = JSON.parse(JSON.stringify(this.tpl));
    let str = '';
    if (x.indent) {
      while (x.indent > 0) {
        str += ' ';
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
      }, '');
    }
    if (x.attributes) {
      str += '(';
      str += x.attributes.map(x => `${x.name}="${x.value}"`).join(' ');
      str += ')';
    }
    if ((x.tag || x.classes || x.id || x.attributes) && x.content) {
      str += ' ';
    }
    if (x.content) {
      str += x.content.value;
    }
    return str;
  }
  toTokens(): TokenInterface[] {
    let x = JSON.parse(JSON.stringify(this.tpl));
    let tokens: TokenInterface[] = [];
    if (x.indent !== undefined) {
      tokens.push({
        type: 'newLineIndent',
        value: x.indent,
      });
    }
    if (x.tag) {
      tokens.push({
        type: 'tag',
        value: x.tag.value,
      });
    }
    if (x.id) {
      tokens.push({
        type: 'id',
        value: x.id.value,
      });
    }
    if (x.classes) {
      tokens = tokens.concat(
        x.classes.map(x => ({
          type: 'class',
          value: x.value,
        }))
      );
    }
    if (x.attributes) {
      tokens = tokens.concat(
        x.attributes.map(x => ({
          type: 'attribute',
          value: {
            name: x.name,
            value: x.value,
          },
        }))
      );
    }
    if (x.content) {
      tokens.push({
        type: 'content',
        value: x.content.value,
      });
    }
    return tokens;
  }
}
