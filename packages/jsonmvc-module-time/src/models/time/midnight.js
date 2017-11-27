
const model = {
  args: {
    hh: '/time/hh'
  },
  fn: ({ hh }) => {
    if (!hh) {
      return
    }

    return hh - (hh % (60 * 60 * 1000 * 24))
  }
}

export default model