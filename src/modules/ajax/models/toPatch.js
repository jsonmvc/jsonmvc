
const model = {
  path: '/ajax/toPatch',
  args: {
    data: '/ajax/byStatus/succesful'
  },
  fn: args => {
    return Object.keys(args.data).reduce((acc, x) => {
      let request = args.data[x]

      if (request.patch === true && !request.patchedAt) {
        acc[x] = request
      }

      return acc
    }, {})
  }
}

export default model
