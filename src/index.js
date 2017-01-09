'use strict'
const fs = require('fs')
const _ = require('lodash')
const most = require('most')
const jsonmvcDB = require('jsonmvc-db')

const jsonmvc = o => {
  let c = o.controllers
  let m = o.models
  let v = o.views

  let db = jsonmvcDB({})

  let inst = {
    c: {},
    m: {},
    v: {}
  }

  _.mapKeys(c, (v, k) => {
    let stream = v(db)

    inst.c[k] = stream.subscribe({
      next: x => {
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

