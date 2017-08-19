
const model = {
  args: {
    data: '/ajax/data'
  },
  fn: args => {
    return Object.keys(args.data).reduce((acc, x) => {
      let request = args.data[x]

      request.labels.forEach(y => {
        if (!acc[y]) {
          acc[y] = {}
        }

        acc[y][request.id] = request
      })

      return acc

    }, {})
  }
}

export default model
