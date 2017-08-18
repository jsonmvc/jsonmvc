
import guid from './../src/index'

it('should return a random 6 chars string', () => {
  let val = guid()
  expect(val).toMatch(/^[0-9a-z]{6}$/)
  expect(val).not.toBe(guid())
})