
let controllers = {
  button: {
    args: {
      config: '/config'
    },
    fn: (x, lib) => {
      console.log('triggered', lib)
      return ({
        op: 'add',
        path: '/value',
        value: 1
      })
    }
  }
}

let models = {
  bam: {
    path: '/bam',
    args: {
      one: '/one'
    },
    fn: x => x + ' bam'
  }
}

let views = {
  foo: {
    name: 'foo',
    args: {
      value: '/value'
    },
    template: `
      <div>
        <p>Text: {{ value }}</p>
        <button data-path="/button">Press me</button>
      </div>`
  }
}

let data = {
  initial: {
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
}

let instance = jsonmvc({
  data: data,
  controllers: controllers,
  models: models,
  views: views
})

