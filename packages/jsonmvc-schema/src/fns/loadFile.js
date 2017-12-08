import fs from 'fs'
import yaml from 'js-yaml'

export default function loadFile(filePath) {
  let data = fs.readFileSync(filePath, 'utf-8')

  if (/\.yml$/.test(filePath)) {
    data = yaml.safeLoad(data)
  } else if (/\.json$/.test(filePath)) {
    data = JSON.parse(data)
  }

  return data
}