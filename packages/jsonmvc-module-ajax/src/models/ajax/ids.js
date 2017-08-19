
const model = {
  args: {
    data: '/ajax/data'
  },
  fn: args => {
    if (args.data) {
      return Object.keys(args.data)
    } else {
      return []
    }
  }
}

export default model
