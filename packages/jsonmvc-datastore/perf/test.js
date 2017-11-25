'use strict'
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite
const jsonpatch = require('fast-json-patch')
const sample = require('./sample.json')

const dbFn = require('./../src/index.js')

const patch = [{
  op: 'add',
  path: '/foo/bar',
  value: sample
}]

const dbPatch = dbFn({
  foo: {}
})

const dbJson = dbFn({
  foo: {}
})

const dbGet = dbFn({
  foo: {
    bar: 123
  },
  boo: {
    baa: {
      bam: 123
    }
  }
})

const nodeLocation = '/qux'
dbGet.node('/baz', ['/foo/bar'], x => x)
dbGet.node(nodeLocation, ['/baz', '/boo/baa/bam'], x => x)

suite.add('DB patch test', {
  fn: function() {
    dbPatch.patch(patch, true, false)
  }
})
.add('Fast-Json-Patch patch test', {
  fn: function () {
    jsonpatch.apply(dbJson.db.static, patch, true)
  }
})
.add('DB get test', {
  fn: function () {
    dbGet.get(nodeLocation)
  }
})
.add('DB has test', {
  fn: function () {
    dbGet.has(nodeLocation)
  }
})
.on('start', x => {
  console.log('Started benchmark...')
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': true });

