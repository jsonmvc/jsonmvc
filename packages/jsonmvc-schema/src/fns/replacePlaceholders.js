
function replacePlaceholers(data, placeholders) {
  for (let i in placeholders) {
    data = data.replace(new RegExp(i, 'g'), placeholders[i])
  }
  return data
}

export default replacePlaceholers