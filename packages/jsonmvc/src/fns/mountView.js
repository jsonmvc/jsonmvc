
import Vue from 'vue'

function mountView(el, component) {
  let root = document.querySelector(el)
  let container = document.createElement('div')

  if (!root) {
    throw new Error('App root element was not found "' + el + '"')
  }

  root.appendChild(container)

  let view = new Vue({
    el: `${el} > div`,
    render: h => h(component)
  })

  return view
}

export default mountView
