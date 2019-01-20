import { TokenStreamClass, TokenInterface } from './compiler/TokenStream';
import { InputStreamClass } from './compiler/InputStream';

export default class Dom {
  compile(template: string): TokenInterface[] {
    let inputStream = new InputStreamClass(template);
    let tokenStream = new TokenStreamClass(inputStream);
    let tokens = tokenStream.run();
    return tokens;
  }
}
