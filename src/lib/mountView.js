
const Vue = require('vue/dist/vue.common.js')

function mountView(el, component) {
  let root = document.querySelector(el)
  let container = document.createElement('div')
  root.append(container)

  let view = new Vue({
    el: `${el} > div`,
    render: h => h(component)
  })

  return view
}

module.exports = mountView
