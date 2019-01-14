const TokenStream = require("./compiler/tokenStream");
const InputStream = require("./compiler/inputStream");

let template = `
div.foobar#foog(aa="23\a" bar="23\\"aa") foo bar baz bam
  div(foo="23\a" bar-id="23\\"aa") foo bar baz bam
`;

let inputStream = new InputStream(template);

let tokenStream = new TokenStream(inputStream);

let tokens = tokenStream.run();

console.log(tokens);
