
function isNewer(o1, o2) {

  let o1r = o1.receivedAt
  let o1c = o1.createdAt
  let o1s = o1.sentAt

  let o2r = o2.receivedAt
  let o2c = o2.createdAt
  let o2s = o2.sentAt


  if (o2r) {
    return !o1r || o1r <= o2r
  } else if (o2s) {
    return !o1s || o1s <= o2s
  } else if (o2c) {
    return !o1c || o1c <= o2c
  }

}

export default isNewer
