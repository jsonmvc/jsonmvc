
const model = {
  args: {
    mm: '/time/mm'
  },
  fn: args => {
    if (!args.mm) {
      return
    }

    return args.mm - (args.mm % (60 * 60 * 1000))
  }
}

export default model
