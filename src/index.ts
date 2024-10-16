const stop = Symbol("stop");

function isNonPrimitive(value: unknown): boolean {
  return (
    (typeof value === "object" && value != null) || typeof value === "function"
  );
}

function doTraverse(
  obj: unknown,
  descriptor: PropertyDescriptor,
  filter: (
    descriptor: PropertyDescriptor,
    path: Array<string | number>,
  ) => boolean,
  beforeCallback:
    | undefined
    | ((
        value: any,
        path: Array<string | number>,
        descriptor: PropertyDescriptor | null,
      ) => void | typeof stop),
  afterCallback:
    | undefined
    | ((
        value: any,
        path: Array<string | number>,
        descriptor: PropertyDescriptor | null,
      ) => void),
  path: Array<string | number>,
  seens: WeakSet<any> | Set<any>,
) {
  if (seens.has(obj)) {
    return;
  }
  if (isNonPrimitive(obj)) {
    seens.add(obj);
  }

  if (beforeCallback) {
    const result = beforeCallback(obj, path, descriptor);
    if (result === stop) {
      return;
    }
  }

  if (Array.isArray(obj)) {
    const children = Array.from(obj);
    for (let i = 0; i < children.length; i++) {
      const childPath = path.concat(i);
      const childDescriptor = Object.getOwnPropertyDescriptor(obj, i)!;
      if (filter(childDescriptor, childPath)) {
        const child = children[i];
        doTraverse(
          child,
          childDescriptor,
          filter,
          beforeCallback,
          afterCallback,
          childPath,
          seens,
        );
      }
    }
  } else if (isNonPrimitive(obj)) {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const keys = Object.keys(descriptors);

    for (const key of keys) {
      const childPath = path.concat(key);
      const childDescriptor = descriptors[key];
      if (filter(childDescriptor, childPath)) {
        const value = (obj as { [key: PropertyKey]: any })[key];
        doTraverse(
          value,
          childDescriptor,
          filter,
          beforeCallback,
          afterCallback,
          childPath,
          seens,
        );
      }
    }
  }

  if (afterCallback) {
    afterCallback(obj, path, descriptor);
  }
}

const defaultFilter = (
  descriptor: PropertyDescriptor,
  _path: Array<string | number>,
) => !descriptor.get;

function traverse(
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
     * If you return `traverse.stop`, children of the current value will not be
     * traversed over.
     */
    before?: (value: any, path: Array<string | number>) => void | typeof stop;

    /**
     * If you provide an `after` callback, it will be called on the way *up*
     * the traversal stack; this is equivalent to a depth-first search.
     */
    after?: (value: any, path: Array<string | number>) => void;

    /**
     * If you provide a `filter` callback, it will be called prior to
     * traversing a path, and its return value will be used to determine
     * whether children of this path should be visited.
     *
     * This will be called before the `before` callback, if there is a
     * `before` callback present.
     *
     * This defaults to a function which returns true for properties which
     * aren't getters.
     */
    filter?: (
      descriptor: PropertyDescriptor,
      path: Array<string | number>,
    ) => boolean;
  },
): void {
  const { before, after, filter = defaultFilter } = callbacks ?? {};

  const syntheticRootDescriptor = {
    value: tree,
    writable: true,
    enumerable: true,
    configurable: true,
  };
  if (!filter(syntheticRootDescriptor, [])) {
    return;
  }

  const setConstructor = typeof WeakSet === "undefined" ? Set : WeakSet;
  doTraverse(
    tree,
    syntheticRootDescriptor,
    filter,
    before,
    after,
    [],
    new setConstructor(),
  );
}

traverse.stop = stop;
traverse.default = traverse;
export = traverse;
