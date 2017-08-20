import ajax from '@fdaciuk/ajax'

import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

const controller = {
  args: {
    reqs: '/ajax/byStatus/unsent'
  },
  fn: stream
    .filter(x => !!x.reqs)
    .chain(x => observer(o => {
      let reqs = x.reqs

      Object.keys(reqs).forEach(x => {
        let request = reqs[x]

        o.next({
          op: 'merge',
          path: `/ajax/data/${request.id}`,
          value: {
            readyState: 1,
            attempts: parseInt(request.attempts, 10) + 1,
            sentAt: new Date().getTime() // db.get('/time/ms')
          }
        })

        ajax(request).always((response, xhr) => {
          let error

          if (xhr.status === 200) {
            // Ensure response is properly parsed
          } else if (xhr.status === 204) {
            response = ''
          }

          switch (xhr.status) {
            case 0:
              error = 'ERR_NAME_NOT_RESOLVED'
              break
            case 404:
              error = 'Page not found'
              break
          }

          o.next({
            op: 'merge',
            path: `/ajax/data/${request.id}`,
            value: {
              readyState: 4,
              statusCode: xhr.status,
              statusText: xhr.statusText,
              error: error,
              url: request.url,
              responseText: xhr.responseText,
              receivedAt: new Date().getTime(), // db.get('/time/ms'),
              responseHeaders: xhr.getAllResponseHeaders(),
              response: response
            }
          })

          // Just add the result on the db
          // Create another controller that parses
          // the result and decides to retry in case of timeout
        })
      })
    }))

}

export default controller
