
function decomposePath(path) {
  let xs = []

  let x = path.slice(0, path.lastIndexOf('/'))
  while(x !== '') {
    xs.push(x)
    x = x.slice(0, x.lastIndexOf('/'))
  }

  return xs
}

export default decomposePath
