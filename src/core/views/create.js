
import Vue from '_vue'
import * as most from 'most'
import Observable from 'zen-observable'
import shortid from 'shortid'

import getPath from '_views/getPath'
import createDataListener from '_views/createDataListener'
import updateInstanceData from '_views/updateInstanceData'

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%^')

const PROP_REGEX = /<([a-z]+)>/g

function createView(db, view, siblings) {

  let observer
  let observable = new Observable(_observer => {
    observer = _observer
  })

  let stream = most.from(observable)
  let self

  let props = {

    // Find what props are required based on the schema
    // e.g. /foo/<id>/bar - "id" will be a required prop
    // on the component
    // <bam id="123"></bam>
    required: [],


    // Linking the required props with the data paths
    // from the schema
    schema: {},

    // On instance props that correlate with data paths
    // subscribes must be made and unsubscribed when
    // the the prop changes
    subscribes: {},

    // When instance props change the data function is not
    // called but watchers. DB.on listeners should be 
    // updated.
    watchers: {}
  }

  // Find all required props
  props.required = Object.keys(view.args).reduce((acc, x) => {
    view.args[x].replace(PROP_REGEX, (a, b, c, d) => {
      if (acc.indexOf(b) === -1) {
        acc.push(b)
      }
    })
    return acc
  }, [])

  if (view.props) {
    props.required = props.required.concat(view.props)
  }

  // Map all props to all schema paths
  props.schema = Object.keys(view.args).reduce((acc, x) => {
    let path = view.args[x]

    if (!acc.paths[path]) {
      acc.paths[path] = []
    }

    path.replace(PROP_REGEX, (a, b, c, d) => {
      if (!acc.tokens[b]) {
        acc.tokens[b] = {
          token: a,
          props: []
        }
      }

      if (!acc.subscribes[b]) {
        acc.subscribes[b] = []
      }

      if (acc.tokens[b].props.indexOf(x) === -1) {
        acc.tokens[b].props.push(x)
      }

      if (acc.paths[path].indexOf(b) === -1) {
        acc.paths[path].push(b)
      }

    })

    return acc
  }, {
    paths: {},
    tokens: {},
    subscribes: {}
  })


  // Watch for changes on the instance properties
  props.watchers = props.required.reduce((acc, x) => {

    acc[x] = function (val) {
      let self = this
      let props = self.__JSONMVC_PROPS
      let data = self.__JSONMVC_DATA
      let rootPath = self.__JSONMVC_ROOT
      updateInstanceData(db, view.args, props, data, self, x, val)
      observer.next({
        op: 'add',
        path: `${rootPath}/props/${x}`,
        value: val
      })
    }

    return acc
  }, {})

  let component = {
    stream,
    component: null,
    instance: null
  }

  component.component = Vue.component(view.name, {
    template: view.template,
    mounted: function () {
      let rootPath = this.__JSONMVC_ROOT

      observer.next({
        op: 'add',
        path: `${rootPath}/mounted`,
        value: true
      })

    },
    beforeCreate: function () {
      let self = this
      let id = shortid.generate()
      let rootPath = `/views/${view.name}/instances/${id}`

      self.__JSONMVC_ID = id
      self.__JSONMVC_PROPS = JSON.parse(JSON.stringify(props))
      self.__JSONMVC_ROOT = rootPath
      self.__JSONMVC_DATA = {}

      component.instance = self

      observer.next({
        op: 'add',
        path: rootPath,
        value: {}
      })
    },
    destroyed: function () {
      let rootPath = this.__JSONMVC_ROOT

      let sub = this.__JSONMVC_PROPS.subscribes

      Object.keys(sub).forEach(x => {
        if (sub[x]) {
          sub[x].forEach(y => {
            y()
          })
        }
      })

      observer.next({
        op: 'add',
        path: `${rootPath}/destroyedAt`,
        value: new Date().getTime()
      })

    },
    data: function () {
      let self = this

      let props = self.__JSONMVC_PROPS
      let data = self.__JSONMVC_DATA

      Object.keys(view.args).forEach(x => {
        let path = getPath(view.args, props, self, x)

        let listener = createDataListener(db, path, data, x)

        props.schema.paths[view.args[x]].forEach(y => {
          props.schema.subscribes[y].push(listener)
        })

        if (!props.subscribes[x]) {
          props.subscribes[x] = []
        }

        props.subscribes[x].push(listener)

      })

      return data
    },
    watch: props.watchers,
    components: siblings,
    props: props.required
  })

  return component
}

module.exports = createView
