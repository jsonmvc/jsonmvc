module.exports = {
  name: 'mounting-test',
  args: {
  },
  template: `
    <div>
      <p>Mounting test: should appear later then hide again</p>
      {{ shouldMount }}
    </div>
  `
}
