
const model = {
  args: {
    data: '/ajax/data'
  },
  fn: args => {
    return Object.keys(args.data).reduce((acc, x) => {
      let request = args.data[x]
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

export default model
