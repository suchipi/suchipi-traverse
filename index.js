const stop = Symbol("stop");

function doTraverse(obj, beforeCallback, afterCallback, path) {
  if (beforeCallback) {
    const result = beforeCallback(obj, path);
    if (result === stop) {
      return;
    }
  }

  if (Array.isArray(obj)) {
    const children = Array.from(obj);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      doTraverse(child, beforeCallback, afterCallback, path.concat(i));
    }
  } else if (typeof obj === "object" && obj != null) {
    const entries = Object.entries(obj);
    for (const [key, value] of entries) {
      doTraverse(value, beforeCallback, afterCallback, path.concat(key));
    }
  }

  if (afterCallback) {
    afterCallback(obj, path);
  }
}

function traverse(obj, { before = null, after = null } = {}) {
  doTraverse(obj, before, after, []);
}

traverse.stop = stop;
traverse.traverse = traverse;

module.exports = traverse;
