
let controllers = [{
  args: {
    config: '/config'
  },
  fn: (x, lib) => ({
    op: 'add',
    path: '/value',
    value: 2
  })
}]

let models = [{
  path: '/bam',
  args: {
    one: '/value'
  },
  fn: x => x.one + ' bam'
}]

let views = [{
  name: 'foo',
  args: {
    value: '/value'
  },
  template: `
    <div>
      <p>Text: {{ value }}</p>
      <button data-path="/button">Press me</button>
    </div>
  `
}]

let data = {
  config: {
    ui: {
      mount: {
        el: '#app',
        component: 'foo'
      }
    }
  },
  value: 1
}

let instance = jsonmvc({
  data: data,
  controllers: controllers,
  models: models,
  views: views
})

