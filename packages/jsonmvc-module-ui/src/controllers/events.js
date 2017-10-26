import * as most from 'most'
import getValue from './../fns/getValue'
import bubbleTo from './../fns/bubbleTo'
import parsePatch from './../fns/parsePatch'
import stream from 'jsonmvc-helper-stream'


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
    .map(x => {
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

        if (firstChar === '{') {
          try {
            value = JSON.parse(value)
          } catch (e) {
            console.error('Tried to JSON.parse ', value, ' from the patch ', x, ' and got ', e)
            throw e
          }
        } else if (firstChar === '[') {
          let prop = x.value.substr(1, x.value.length - 1)
          x.value = getValue(el, prop)
        } else if (firstChar === '\'' || firstChar === '\"') {
          x.value = x.value.substr(1, x.value.length - 1)
        } else if (/[0-9]/.test(firstChar)) {
          x.value = parseFloat(x.value)
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
