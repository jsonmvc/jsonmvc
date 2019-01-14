const TokenStream = require("./compiler/tokenStream");
const InputStream = require("./compiler/inputStream");

let template = `
div
  | .foobar
  |#f // both are valid with or without whitespace
  |(
  | foogaa="23\a"
  | bar="23\\"aa"
  |) foo bar baz bam {{ foo }}
`;

let inputStream = new InputStream(template);

let tokenStream = new TokenStream(inputStream);

let tokens = tokenStream.run();

console.log(tokens);
