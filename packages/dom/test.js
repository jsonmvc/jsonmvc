const { Dom } = require('./dist/index');

const dom = new Dom();

let result = dom.compile(`
div
  |.foo
  |#bar
  |(bam="boo)
  | baz
`);

console.log(result);
