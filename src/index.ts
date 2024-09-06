const stop = Symbol("stop");

function isNonPrimitive(value: unknown): boolean {
  return (
    (typeof value === "object" && value != null) || typeof value === "function"
  );
}

function doTraverse(
  obj: unknown,
  beforeCallback:
    | undefined
    | ((value: any, path: Array<string | number>) => void | typeof stop),
  afterCallback:
    | undefined
    | ((value: any, path: Array<string | number>) => void),
  path: Array<string | number>,
  seens: WeakSet<any> | Set<any>
) {
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
      const value = (obj as { [key: PropertyKey]: any })[key];
      doTraverse(value, beforeCallback, afterCallback, path.concat(key), seens);
    }
  }

  if (afterCallback) {
    afterCallback(obj, path);
  }
}

function theTraverse(
  /**
   * The tree structure to traverse.
   */
  tree: any,

  /**
   * Callbacks to call during traversal
   */
  callbacks?: {
    /**
     * If you provide a `before` callback, it will be called on the way *down*
     * the traversal stack; this is equivalent to a breadth-first search.
     *
     * If your before callback returns `stop`, the children of the value that was
     * passed into your callback will not be traversed over.
     */
    before?: (value: any, path: Array<string | number>) => void | typeof stop;

    /**
     * If you provide an `after` callback, it will be called on the way *up*
     * the traversal stack; this is equivalent to a depth-first search.
     */
    after?: (value: any, path: Array<string | number>) => void;
  }
) {
  const { before, after } = callbacks ?? {};

  const setConstructor = typeof WeakSet === "undefined" ? Set : WeakSet;
  doTraverse(tree, before, after, [], new setConstructor());
}

const traverse: {
  (
    /**
     * The tree structure to traverse.
     */
    tree: any,

    /**
     * Callbacks to call during traversal
     */
    callbacks?: {
      /**
       * If you provide a `before` callback, it will be called on the way *down*
       * the traversal stack; this is equivalent to a breadth-first search.
       *
       * If your before callback returns `stop`, the children of the value that was
       * passed into your callback will not be traversed over.
       */
      before?: (value: any, path: Array<string | number>) => void | typeof stop;

      /**
       * If you provide an `after` callback, it will be called on the way *up*
       * the traversal stack; this is equivalent to a depth-first search.
       */
      after?: (value: any, path: Array<string | number>) => void;
    }
  ): void;

  stop: typeof stop;
} = Object.assign(theTraverse, {
  stop,
}) as any;

export default traverse;
export { stop, traverse };
