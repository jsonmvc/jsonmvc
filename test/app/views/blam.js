
module.exports = {
  name: 'blam',
  args: {
    count: '/foo'
  },
  el: `
    <div v-if="count == 124">BLLAAAAAM</div>
  `
}
