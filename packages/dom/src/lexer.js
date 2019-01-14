const TokenStream = require("./compiler/tokenStream");
const InputStream = require("./compiler/inputStream");

let template = `
div
  | .foobar
  |#f // both are valid with or without whitespace
  |(
  | data-patch:mouseenter="
  |   add /foo/bar 123;
  |   add /bar/baz 321;
  | "
  | data-patch:click="
  |   add /foo/bar 123;
  | "
  |) foo bar baz bam {{ foo }}
`;

let inputStream = new InputStream(template);

let tokenStream = new TokenStream(inputStream);

let tokens = tokenStream.run();

console.log(tokens);
