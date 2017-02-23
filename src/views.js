const Vue = require('vue/dist/vue.common.js')
const Emitter = require('events').EventEmitter
const most = require('most')
const shortid = require('shortid')
const PROP_REGEX = /<([a-z]+)>/g
const _ = require('lodash')

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%^')




