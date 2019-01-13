const TokenStream = require("./compiler/tokenStream");
const InputStream = require("./compiler/inputStream");

let template = `
div.bam foo bar baz bam
  div.bam foo bar baz bam
    div#foo.bam foo
`;

let inputStream = new InputStream(template);

let tokenStream = new TokenStream(inputStream);

let tokens = [];
while (!tokenStream.eof()) {
  tokens.push(tokenStream.next());
}

console.log(tokens);
