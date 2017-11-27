
const model = {
  args: {
    mm: '/time/mm'
  },
  fn: ({ mm }) => {
    if (!mm) {
      return
    }

    return mm - (mm % (60 * 60 * 1000))
  }
}

export default model
