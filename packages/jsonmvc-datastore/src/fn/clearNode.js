
function clearNode(o, path) {

  Object.keys(o).forEach(x => {
    let pos = o[x].indexOf(path)
    if (pos !== -1) {
      o[x].splice(pos, 1)
      if (o[x].length === 0) {
        delete o[x]
      }
    }
  })

}

export default clearNode
