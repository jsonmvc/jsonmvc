
/**
 * Reads and validates the following syntax:
 *
 * module.exports = {
 *  args: Object | String | Array,
 *  stream: Function,
 *  patch: x => ({
 *    op: 'add',
 *    path: '/foo/bar2',
 *    value: x
 *  })
 * }
 *
 * args
 * -- Object: { title: '/foo/bar', date: '/time/ms'}}
 * -- String: '/foo/bar'
 * -- Array: ['/foo/bar', '/time']
 *
 * stream: Function
 * function (stream) {
 *    return stream
 *      .map(x => x + 1)
 *  }
 */

function parse(controller) {

}

export default parse


