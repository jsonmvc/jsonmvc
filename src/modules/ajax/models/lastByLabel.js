import isNewer from './../fns/isNewer'

const model = {
  path: '/ajax/lastByLabel',
  args: {
    data: '/ajax/byLabel'
  },
  fn: args => {
    return Object.keys(args.data).reduce((acc, x) => {
      acc[x] = Object.keys(args.data[x]).reduce((acc2, y) => {
        let o = args.data[x][y]

        if (!acc2 || isNewer(acc, o)) {
          acc2 = o
        }

        return acc2
      }, undefined)
      return acc
    }, {})
  }
}

export default model
