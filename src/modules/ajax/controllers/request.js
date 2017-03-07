import ajax from '@fdaciuk/ajax'
import * as most from 'most'
import Observable from 'zen-observable'

module.exports = {
  args: ['/ajax/byStatus/unsent'],
  stream: stream => stream
    .filter(x => !!x)
    .chain(reqs => {

      let observable = new Observable(observer => {

        Object.keys(reqs).forEach(x => {
          let request = reqs[x]

            observer.next({
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
                break;
              case 404:
                error = 'Page not found'
                break;
            }

            observer.next({
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

      })

      return most.from(observable)
    })

}

/*

const completed = (id, xhr, textStatus, ctx) => {
  let request = db.get(`/ajax/data/${id}`)

  if (
    // (textStatus === 'timeout' || xhr.status === 500 || xhr.status === 404)
    xhr.status !== 200
    && xhr.status !== 204
    && ctx.attempts < ctx.maxAttempts
  ) {

    console.log(`Retrying ${request.url}`)

    ctx.attempts += 1

    db.patch([{
      op: 'add',
      path: `/ajax/data/${id}/attempts`,
      value: ctx.attempts
    }])

    jquery.ajax(ctx)
    return false

  }

  let response

  if (equals(xhr.status, 200)) {
    response = xhr.responseText

    if (xhr.responseJSON) {
      response = xhr.responseJSON
    } else if (match(/\.json$/, request.url)) {
      try {
        response = JSON.parse(xhr.responseText)
      } catch (e) {
        console.error(`The request at ${request.url} should have returned a valid JSON text`)
      }
    }
  } else if (equals(xhr.status, 204)) {
    response = ''
  }

  db.patch([{
    op: 'merge',
    path: `/ajax/data/${id}`,
    value: {
      readyState: 4,
      statusCode: xhr.status,
      statusText: xhr.statusText,
      error: response ? has('error', response) : false,
      url: request.url,
      responseText: xhr.responseText,
      receivedAt: db.get('/time/ms'),
      responseHeaders: xhr.getAllResponseHeaders(),
      response: response
    }
  }])

}

*/
