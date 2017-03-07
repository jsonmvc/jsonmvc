
import Vue from 'vue'

function mountView(el, component) {
  let root = document.querySelector(el)
  let container = document.createElement('div')
  root.appendChild(container)

  let view = new Vue({
    el: `${el} > div`,
    render: h => h(component)
  })

  return view
}

module.exports = mountView
