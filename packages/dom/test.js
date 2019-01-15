const { Dom } = require('./dist/index');

const dom = new Dom();

let result = dom.compile(`
div.bar foo
  .bam foo
    div#bim bam
`);

console.log(result);
