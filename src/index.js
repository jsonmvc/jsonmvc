'use strict'
const fs = require('fs')
const _ = require('lodash')
const most = require('most')
const jsonmvcDB = require('jsonmvc-db')
const Emitter = require('events').EventEmitter

const jsonmvc = o => {
  let c = o.controllers
  let m = o.models
  let v = o.views
  let s = o.schema

  let db = jsonmvcDB({})

  let inst = {
    c: {},
    m: {},
    v: {}
  }

  _.mapKeys(c, (v, k) => {
    let emitter = new Emitter()
    let path = s.controllers[k]
    let inStream = most.fromEvent('data', emitter)

    db.on(path, x => {
      emitter.emit('data', x)
    })

    let outStream = v(inStream)

    inst.c[k] = outStream.subscribe({
      next: x => {
        if (x && !_.isArray(x)) {
          x = [x]
        }
        db.patch(x)
      },
      complete: x => {
        console.log(`Stream ${k} has ended`)
      },
      error: x => {
        console.error(`Stream ${k} has an error`, x)

      }
    })

  })

  db.patch([{
    op: 'add',
    path: '/foo',
    value: 123
  }])

  return {
    update: x => {
      console.log('updating')
    }
  }

}

module.exports = jsonmvc

// Load all html files
// Load the data.yml
// Use the default one (app.html) to start processing

// Load data.yml
// Assess which data corresponds to which element
// parse each path and uncover what props each
// component is waiting for

// Create Vue components for each element
// from app onwards

// Mount app.html
// And on mount for every component it encounters
// bind to the data stream

