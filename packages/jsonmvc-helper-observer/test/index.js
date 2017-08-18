
import lib from './../src/index'

it('should pass the values to the observer', () => {
  return lib(obs => {
    obs.next(10)
    obs.complete()
  })
  .forEach(x => {
    expect(x).toBe(10)
  })
})

