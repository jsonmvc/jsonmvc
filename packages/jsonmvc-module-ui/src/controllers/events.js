import * as most from 'most'
import stream from 'jsonmvc-helper-stream'

import getValue from './../fns/getValue'
import bubbleTo from './../fns/bubbleTo'
import parsePatch from './../fns/parsePatch'
import {
  numberRegExpStr,
  textRegExpStr,
  objRegExpStr,
  htmlAttrRegExpStr,
  pathOptRegExpStr
} from './../fns/parsePatch'

const numberRegExp = new RegExp('^' + numberRegExpStr + '$', 'g')
const objRegExp = new RegExp('^' + objRegExpStr, 'g')
const textRegExp = new RegExp('^' + textRegExpStr + '$', 'g')
const htmlAttrRegExp = new RegExp('^' + htmlAttrRegExpStr + '$', 'g')
const pathRegExp = new RegExp('^' + pathOptRegExpStr + '$', 'g')

const controller = {
  args: {
    events: '/config/ui/events'
  },
  fn: stream
    .filter(x => !!document && !!document.body)
    .chain(x => {
      let events = x.events
      let streams = Object.keys(events).map(x => {
        let e = events[x]
        let stream = most.fromEvent(x, document.body)

        if (e.debounce) {
          stream = stream.debounce(e.debounce)
        }

        return stream
      })

      return most.mergeArray(streams)
    })
    .map(e => {
      return {
        el: bubbleTo('[data-patch]', e),
        e: e
      }
    })
    .filter(x => !!x.el)
    .map((x, lib) => {
      if (x.el.hasAttribute('href')) {
        x.e.preventDefault()
      }

      let el = x.el

      let str = el.getAttribute('data-patch')

      let patches = parsePatch(str)

      // Parse and convert the value
      patches = patches.map(x => {
        if (!x.value) {
          return x
        }

        let firstChar = x.value[0]

        let match = {
          obj: x.value.match(objRegExp) !== null,
          htmlAttr: x.value.match(htmlAttrRegExp) !== null,
          path: x.value.match(pathRegExp) !== null,
          text: x.value.match(textRegExp) !== null,
          number: x.value.match(numberRegExp) !== null
        }

        if (match.obj) {
          try {
            x.value = JSON.parse(x.value)
          } catch (e) {
            console.error('Tried to JSON.parse ', value, ' from the patch ', x, ' and got ', e)
            throw e
          }
        } else if (match.htmlAttr) {
          let prop = x.value.replace(/^attr\./, '')
          x.value = getValue(el, prop)
        } else if (match.path) {
          x.value = lib.get(x.value)
        } else if (match.text) {
          x.value = x.value.substr(1, x.value.length - 2)
        } else if (match.number) {
          x.value = parseFloat(x.value)
        } else {
          throw new Error('Patch value not recognized "' + x.value + '". It should start and end with {..}, [..], \'..\', "..", or be a number')
        }

        return x
      })

      return patches
    })

// @TODO: Timestamp events by their exact time relative to the /time/ms time
// in order to avoid having two events at the same timestamp but in reality they
// were a smaller distance than the increment chosen for the /time/ms
//
// A better decision is to use performance.now() so that the time recording of events
// reflects the moment since the application started running which is much more 
// appropiate than using timestamps. The only caveat though is to store the start
// timestamp.
    
}

export default controller
