'use strict'
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite
const jsonpatch = require('fast-json-patch')

const dbFn = require('./../src/index.js')

const patch = [{
  op: 'add',
  path: '/foo/bar',
  value: 123
}]

const db = dbFn({
  foo: {}
})

suite.add('Db patch test', {
  fn: function() {
    db.patch(patch)
  }
})
.add('Fast-Json-Patch patch test', {
  fn: function () {
    jsonpatch.apply(db.db.static, patch, true)
  }
})
.on('start', x => {
  console.log('Started benchmark...')
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });

