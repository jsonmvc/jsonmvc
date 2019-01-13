const { Document } = require("nodom");
global.document = new Document();
const {
  el,
  h,
  html,
  list,
  List,
  listPool,
  ListPool,
  mount,
  unmount,
  place,
  Place,
  router,
  Router,
  setAttr,
  setStyle,
  setChildren,
  s,
  svg,
  text
} = require("redom");
