declare const stop: unique symbol;

interface Traverse {
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
}

declare const traverse: Traverse;

export = traverse;
