const hasOwnProperty = Object.prototype.hasOwnProperty;

const stop = Symbol("stop");

function isNonPrimitive(value) {
  return (
    (typeof value === "object" && value != null) || typeof value === "function"
  );
}

function doTraverse(obj, beforeCallback, afterCallback, path, seens) {
  if (seens.has(obj)) {
    return;
  }
  if (isNonPrimitive(obj)) {
    seens.add(obj);
  }

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
      doTraverse(child, beforeCallback, afterCallback, path.concat(i), seens);
    }
  } else if (isNonPrimitive(obj)) {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const keys = Object.entries(descriptors)
      .filter(([_key, descriptor]) => {
        return typeof descriptor.get === "undefined";
      })
      .map(([key, _descriptor]) => key);

    for (const key of keys) {
      const value = obj[key];
      doTraverse(value, beforeCallback, afterCallback, path.concat(key), seens);
    }
  }

  if (afterCallback) {
    afterCallback(obj, path);
  }
}

function traverse(obj, { before = null, after = null } = {}) {
  doTraverse(obj, before, after, [], new (WeakSet || Set)());
}

traverse.stop = stop;
traverse.traverse = traverse;

module.exports = traverse;
