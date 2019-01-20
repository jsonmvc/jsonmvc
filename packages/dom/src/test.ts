import Dom from './index';

/*
  The most opinionated js framework on the planet.

  Features:
  - No boilerplate code
  - Context aware features
  -

  Model-driven engineering
  https://en.wikipedia.org/wiki/Model-driven_engineering


  ---
  Track mutation at the database end:
  If there is an object that is iterated on then use that iteration to finger-print each item
  e.g. use their key to identify them then and link the element reference to the database
  reference - if a patch modifies that location that is currently in the dom then update
  directly the element in question - avoiding the entire reprocessing of the view / going
  through complex calculations based on the parent object.
  There is never the need to :key or add an ID to an element - everything is happening
  automatically.
  Arrays however expose a problem if they are overwritten while preserving the same elements with a few additions at the tail.
  In order to circumvent a logistical issue with introducing the responsibility of
  tagging at the ui end - this is a problem that needs to be addressed at the data end.
  Array items should be responsible for making themselves unique - e.g. via an _unique field
  similar to MongoDB approach.
  For an out-of-the-box solution, arrays can be indexed automatically based on:
  a) the position of the item in the array
  b) the content of the item
  thus generating a hash that will be then used when the array is changed entirely
  _unique_key = hash(pos, content)
  However if the position is changed, the hash can still be made and figure out what has changed trying to
  find the previous identical items.
*/

/*
  Directive
  ---
  [name](:[modifier])?\s[body](\?[conditional])?

  Class
  ---
  .foo
  .item-{{ index }}-name // .item-1-name
  .red ? !isValid

  A comment can also be a directive - it does not influence the end code but it
  influences debugging

  Debugger
  ---
  div(
    debugger
    for item in items
  )

  This will render everything until this element and then let the user inspect the variables available
  at this location.

  Attributes
  ---
  div(
    name= isFooBar + "bla"
    data-id=`item-${index}`
  )

  [name]=[code]
  After the equal sign can follow a string name="foo" or simply a variable that
  will be converted to string name=fooName or code that can be executed as an expression
  name=count > 1 ? 'many' : 'one'

  @TODO: Include http://jsep.from.so/ for parsing JS expressions!

  attr="foo"
  attr=userName
  attr=`name-${userName}`
  attr="name-" + userName
  attr=isValid ? 'ok' : 'not-ok'
  attr="name" ? isValid

  Patches
  ---
  patch OP PATH JSExpression

  patch merge /foo { foo: 123 }

  patch add /foo valid + 123
  -> This has several conditions:
  - if it looks like a number then it is converted to a number
  - if it looks like a string then it is convert to string
  - if there is a schema at that location then coerce the value to that schema value

  Automatic detection for nested access:
  obj.name.prop[foo]

  This expands to obj && obj.name && obj.name.prop && obj.name.prop[foo] in order to avoid "cannot read X of undefined"

*/

let template1 = `
name: /user/name
surname: /user/surname
isAuth: /user/isAuth
---
.db
  .f1.b Sample form
  -- fullName = name + surname
  div#email-field.f4(
    name="foobar"
    customAttr="bla " + name ? isAuth
    // something needs to be said about the following line
    .red ? !isValid
    .item-{{ index }}
    patch add /foo/bar 123 ? isValid
    patch:blur add /foo/bar "{{ name }}"
    if isValid
    for (value, key, index) in errors
    html contentVariable
  ) The award goes
    | to multiline content
    | named {{ fullName }}

  button(
    patch:blur add /foo/bar 123
    if isValid
    for error in errors
    content:html fooBar
  )

  button(
    if isSubmit
    name="foo"
    patch add /form/submit true
  ) Submit email

  /* Commenting
  // Comment
  -- fullName = name + surname
  .db(
    bla="bla" ? isFoo
    .red ? isValid
    if isSubmit ? isFoobar
    patch add /foo 123 ? isbamboo
    html contentVariable ? isFloop
  )
    .db(
      for error in errors
    ) {{ error }}
`;

let template2 = `
div[add /foo/bar "{{ bar }}"] Doo dap
`;

let dom = new Dom();

template1;

let result = dom.compile(template2);
console.log(result);
