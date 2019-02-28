import get from "./getValue";
import applyPatch from "./applyPatch";

function randomId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

function errPatch(db, path, obj) {
  var err = get(db.static, path);

  err.value = obj;
  err.id = path;
  err.refId = randomId();

  db.errors[err.refId] = err;

  applyPatch(
    db,
    [
      {
        op: "add",
        path: `/err/${err.name}/-`,
        value: err
      }
    ],
    true
  );
}

export default errPatch;
