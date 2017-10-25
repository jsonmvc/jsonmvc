
const model = {
  args: {
    ms: '/time/ms'
  },
  fn: args => {
    if (!args.ms) {
      return
    }

    return args.ms - (args.ms % (60 * 1000))
  }
}

export default model
