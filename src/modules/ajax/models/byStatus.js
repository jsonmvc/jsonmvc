
module.exports = {
  path: '/ajax/byStatus',
  args: ['/ajax/data'],
  fn: data => {
    return Object.keys(data).reduce((acc, x) => {
      let request = data[x]
      let type

      if (!request.sentAt) {
        type = 'unsent'
      } else if (!request.receivedAt) {
        type = 'pending'
      } else if (request.readyState === 4 && request.statusCode === 200) {
        type = 'succesful'
      } else if (request.error) {
        type = 'failed'
      } else {
        type = 'unknown'
      }

      acc[type][x] = request

      return acc
    }, {
      unsent: {},
      pending: {},
      succesful: {},
      failed: {},
      unknown: {}
    })
  }
}
