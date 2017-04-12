
module.exports = {
  name: 'the-footer',
  args: {
    title: '/foo',
    items: '/items'
  },
  template: `
    <div>
      <div>Footer {{ title }}</div>
      <div v-for="item in items">
      <bang :id="item"></bang>
      </div>
    </div>
  `
}
