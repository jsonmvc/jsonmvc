
module.exports = {
  name: 'blam',
  args: {
    count: '/foo'
  },
  template: `
    <div v-if="count == 124">BLLAAAAAM</div>
  `
}
