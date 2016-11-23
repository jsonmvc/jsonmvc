
- Add performance break points for Model.performance() or other segmentation utils
- Create a Chrome Dev Tool for the visual segmentation and performance debugging
- Create a refresh strategy for Model dynamic nodes so that
  continuous development on a single node can occur without state refresh
- Keep ui data in both original and parsed form according to the JSON Schema
- Augment the path system with additional properties: e.g: "/foo/bar:nth(n - 1)" to get the previous
  value from /foo/bar. "/foo/bar:has('a')". node("/foo/bar:contains("foo")", transform)
  This is very similar to CSS selectors and can add a lot of value to the json system.

- The dynamic node computation algorithm has the following gist:
  Each essential data has determined characteristics and validation functions
  that the dynamic node can use when mapping onto the json path in order to
  further reduce the likelihood for the transformation to be triggered.

  node([{
    path: "/foo/bar",
    on: {
      prop: ['completed', false]
    },
    filter: {
      contains: 'text',
      length: '>0'
    }
  }], {
    fn: reducerF,
    characteristics: {
      string: ['length', /regex/]
    }
  })


  [
    /foo, -> return prevFoo.length === foo.length ? false : true
  ]

  node("/foo/bar:ignore(length=0)", reducerF)

- The first line of defence to avoid unnecessary recalculation is to enable caching of
  values between transformations so that a transformation is only triggered if the dynamic
  node its listening to outputs a different value

- Add indexes similar to firebase so that transactions linking with ids are possbile

- Simply state update logic:
db.data({
  foo: '/bar/baz',
  bam: '/bam/bam'
}).onValue(data => {
  self.data = data
  self.update()
})

where ``` db.data ``` will return a stream of data changes that gives the same data plus the new changes.
In turn each data property will listen to the database updates.
The database will support batch updates like these to avoid individual listeners.
By having a batch update setup we give a declarative way of describing the full data set required for
a component to function - this way powerfull optimisations are possible plus a enhanced control.

- Adding a transformation of data in the view is a very bad idea. E.g.

View.data(this, {
  foo: ['/foo/bar', length]
})

This way the view is inconsistent with the data structure, if a data transformation is needed then
a dynamic node should be created on the data tree. In order to ensure this, all data declaration
should happen outside the View module or statically inside it.


------
-----
Dynamic nodes are of three cathegories: alterating, combinating and mixed.
Based on the type of dynamic node optimisations can be performed - combinating can cache
the past values and only apply the new value, alterating can cache the context
while mixed cannot be predicted.

At compilation the dynamic nodes are parsed and a new code is generated that is optimal
similar to how Emscriptem will take C code and generate JavaScript code.
A help in this regard will be using a standard library for declaring transformations.

Another optimisation is using tests declaration afferent to the dynamic node in order
to generate subsequent better code optimised for processing.



-----
-----

A sample interface:

---- Model ----

import { db } from 'jsonmvc'

{
  foo: {
    bar: db.on(['/bam', '/baz'], (bam, baz) => {

    })
  }
}

--- View ---
<div data-bind="{
  foo: '/bar/baz',
  bam: '/bar/bam',
  boo: '/boo/bam'
}">
  <h1>{ data.foo }</h1>
  <h2>{ data.bam }</h2>

  <ul data-each="/foo/bam">
    <li>{ foo } is for { data.foo }</li>
  </ul>

  <div data-bind="{
    foo: '/boo/baa'
  }">
    { data.foo }
  </div>

</div>

'#foo': {
  bam: '/bar/bam',
  baz: '/boo/ba'
}


!!!! Implement https://github.com/snabbdom/snabbdom as the virtual dom layer
Seems like an interesting abstraction over snabbdom: https://github.com/AlexGalays/kaiju
Look over their observable source


[TESTING]

1. Full json patch testing using https://github.com/Starcounter-Jack/JSON-Patch/tree/master/test/spec
2. Integrate with FakerJS to generate randomized datasets & patches see http://json-schema-faker.js.org/
3. Build a generator for fake dynamic nodes using the datasets
4. Integrate jsPerf to get benchmarks



[Interactivity]
Create something special - an interactive tutorial to your application. In order to create the
schema first enter some data, how you expect your application to look like. Will the user
have a name, how would that be like?
Record different values that generate regexes for you and also records those values for later review.

The JSON schema is generated for you based on your content.
A default HTML will be generated on that schema to help you get started.

Instead of having a boilerplate of the framework or a sandbox project from which you get inspired,
or even a step by step process in which you select what you need (like yeoman), this interactive
part will help you really get started and following your train of though while creating your application.

You'll learn the framework but not by reading documentation and through a clever tutorial, instead
this interaction will guide you towards a well defined and balanced application from the get go.

There's a low chance of making mistakes or making things not so efficient - the concepts are so
simple and the framework so simplified that there is little room for error. You're crafting 
a performant application from the very start.

The best part is that you can revisit this any time you need some assistance - unlike other
frameworks or systems that once you pass the introduction tutorial you won't ever need it again
as the information there is irrelevant. But this system is different, it gets more relevant
as the application grows.



------
Alternative way of structuring the view
------

In a given component disallow data less values. The global
data holds all the data in the given component and is avaiable
both for iterations or nestings.

No else ifs. Just if. If you need and else then you need to define
that as a condition on your data set.

EACH -> if it's an object then KEY will be object key
        if it's an array then KEY will be the index

No longer needed the {{ }} brackets, just put data.something in your
html and that's it. If you really want to use something as "data.blabla"
just don't declare it on your data table - this will be shown in plain.
Only properties that exist on your data set will be replaced.
You will be notified if any data.blabla was matched but not found
in your data table.

'#123': {
  title: '/foo/bar/title',
  articles: '/articles/list',
  newUser: '/isNewUser',
  userName: '/user/name'
}

// value & key namings are forbidden
// in order to be available in block scopes

<div id="123">
  <h1>data.title</h1>
  <span>Your name is data.userName</span>
  <p data-if="data.newUser">Welcome new user</p>
  <ul>
    <li data-each="data.articles">
      <p>data.articles[key].title</p>
      <p>data.articles[key].description</p>
    </li>
  </ul>
  <button id="foo"></button>
</div>

<div id="123">
  <h1>{ title }</h1>
  <span>Your name is { userName }</span>
  <p data-if="{ newUser }">Welcome new user</p>
  <ul>
    <li data-each="{ articles }">
      <span>Number { key }</span>
      <p>{ value.title }</p>
      <p>{ value.description }</p>
      <span data-each="{ value.comments }">

      </span>
    </li>
  </ul>
  <button id="foo"></button>
</div>

db.on('/events/hover/#123 #foo')
db.on('/events/click/#123 ul li')
db.on('/events/click/#dis .foo[data-path="asdf"]:nth-child(2)[attr^=val]')


--------
Make patch polymorphic
--------
db.patch({
  op: 'add',
  path: '/foo/bar',
  value: 123
})

db.patch('add', '/foo/bar', 123)

db.patch([
  { .. },
  { .. }
])


-------
Implement https://snyk.io/ for testing the repo's vulnerabilities
and https://nodesecurity.io for the node version
--------

------
Save arrays in an object like manner? 
db.on('/foo/bar/23')
Where this would give the 23rd element?
And that gives a way to change elements without getting the entire array


--------
Controller definition
-------
A controller should contain all the utils necessary for inserting data in the application
and communicating with the outside world.

To this extent it needs some basic functionalities out of the box:
- Ajax
- Sockets
- SSE
- DOM Api
- HTTP server
- File IO

- Storage (this could be the same API for both nodejs and browser.
      It takes a configuration object (that sits on the state tree)
      and depending where it is it acts accordingly)
      -- although this might be better handled at db level

A controller takes a model and outputs a patch which is fed in the system
Ad-hoc patches make the architecture less streamlined.

The architecture of a controller consists of:
path -> fns -> async -> fns -> patch

The patch should also be predictable. In usage so far, a wildcard match
would be perfect for this:

[ entity/\*/title ] would be the patch

so a controller can be defined as:
path/s X -> path/s Y

And thus making it more reliable
By giving this information from the very begning one shouldn't build a patch
at the end, just give a value that will be mapped to the specified path

var c1 = controller(['/foo/bar', '/bam'])
  .map(add)
  .filter(isNotEmpty)
  .ajax(x => { request })

module.exports = merge([controller1, controller2])
  .map(x => ({
    op: 'add',
    path: `/foo/${x.id}`,
    value: x
  }))

-- If the ajax is on a patch api then this will return
a patch

controller('/foo/bar', ['/foo1', '/foo2'])

controller.patch -> will create a patch object, it is also polymorphic
so it can take string arguments or a function for composition

controller.patch(x => 


------
Aggregating patches
------
There should be a single way of making patches in the system thus
ensuring that every component is created in a linear fashion.

This should be enforced - although not many people will like this - 
this could be a best practice actually instead of being enforced...
creating the API should guide towards this way of doing things.


------
JSONMVC + FP (ramda or lodashfp)
------
Define all functions as globals (as ramda-loader does) so that fp
can be done simply and out of the box - with minimal learning curve:
you can write JS as you like and slowly discover the FP Api


------
Build process
-----
Comes with a build process already defined (e.g. webpack/brocolli etc) which serves
by default a certain environemnt - e.g ES6.
Implement an error handling layer that takes the code that developers write and
if it's in a different module system (CommonJS vs AMD, etc) then it gives
a relevant error message mentioning to the developer that he can change this setting
as he pleases.

The idea is to have this a flexible as possible so that it makes the developer productive
from day one (it doesn't need to configure anything) and allows him to further refine
the build process as he's progressing with his app development.

A hybrid build process might be nice! In which JSONMVC does some parts while the custom
system the developer puts into place handles the rest.

Adding typescript would be easy - just include a module jsonmvc-typescript and there you go,
you can now configure the build process as you please (with a build sandbox containing all
the best practices)
Same goes for webpack, jsonmvc-webpack, etc.


