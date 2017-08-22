import jsonmvc from 'jsonmvc'

let mod
if(__DEV__) {
  mod = require('./../src/index').default
} else {
  mod = require('./../dist/jsonmvc-module-ui')
}

it('should init properly', () => {
  // let instance = jsonmvc(mod)

})
