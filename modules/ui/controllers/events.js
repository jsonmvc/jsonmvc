import * as most from 'most'
import getValue from './../fns/getValue'
import bubbleTo from './../fns/bubbleTo'

module.exports = {
  args: ['/config/ui/events'],
  stream: stream => stream
    .chain(events => {
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
      e.preventDefault()
      return bubbleTo('[data-path]', e)
    })
    .filter(el => el !== null)
    .map(el => {
      let result = {
        path: el.getAttribute('data-path'),
        value: null
      }

      if (el.hasAttribute('data-value')) {
        result.value = el.getAttribute('data-value')
      } else {
        result.value = getValue(el)
      }

      return result
    })

// @TODO: Timestamp events by their exact time relative to the /time/ms time
// in order to avoid having two events at the same timestamp but in reality they
// were a smaller distance than the increment chosen for the /time/ms

    .map(x => ({
      op: 'add',
      path: x.path,
      value: {
        value: x.value,
        timestamp: new Date().getTime() // db.get('/time/ms')
      }
    }))
}
