import path from 'path'

import loadFile from './loadFile'

const cwd = process.cwd()
const fileRegex = /^file:(.+?)(?:#(.*))?$/

export default function refLoader(ref, options, fn) {
  const baseFolder = options.baseFolder ? path.resolve(cwd, options.baseFolder) : cwd
  let [match, file, nested] = ref.match(fileRegex)

  if (!file) {
    return fn()
  }

  let data = loadFile(path.join(baseFolder, file))

  try {
    nested = nested ? nested.split('/') : []
    for (let i = 0; i < nested.length; i += 1) {
      data = data[nested[i]]
    }
  } catch (e) {
    throw new Error(`Nested path ${JSON.stringify(nested)} could not be loaded from ${file}\n${e.message}`)
  }

  return fn(null, data)
}