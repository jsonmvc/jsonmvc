Based on the excellent parser tutorial:
http://lisperator.net/pltut/parser/

- Conditional classes:
  div.foo?{{isValid}} Text content

- Element concatenation
  div
  |.foo?{{isValid}}
  |.bar
  |.bam
  | Text content
