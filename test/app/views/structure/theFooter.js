
module.exports = {
  name: 'theFooter',
  args: {
    title: '/foo',
    items: '/items'
  },
  el: `
    <div>
      <div>Footer {{ title }}</div>
      <div v-for="item in items">
      <bang :id="item"></bang>
      </div>
    </div>
  `
}
