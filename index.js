function doTraverse(obj, callback, path) {
  if (Array.isArray(obj)) {
    const children = Array.from(obj);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      doTraverse(child, callback, path.concat(i));
    }
    callback(obj, path);
  } else if (typeof obj === "object" && obj != null) {
    const entries = Object.entries(obj);
    for (const [key, value] of entries) {
      doTraverse(value, callback, path.concat(key));
    }
    callback(obj, path);
  } else {
    callback(obj, path);
  }
}

function traverse(obj, callback) {
  doTraverse(obj, callback, []);
}

module.exports = traverse;
