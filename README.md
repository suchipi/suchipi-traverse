# `@suchipi/traverse`

Basic traverse function for deeply iterating over objects/arrays/etc.

## Features

- Only searches through an object's own properties
- Can handle mutation/deletion during traversal
- Provides your visitor callback a path to the current value (in addition to the value itself)
- Avoids traversing over already-traversed values, to avoid cycles

## Usage

```js
import { traverse } from "@suchipi/traverse";

// It can traverse any JSON-compatible structure.
const tree = {
  type: "Root",
  left: {
    type: "Left",
    children: [1, 2, 3],
  },
  right: {
    type: "Right",
    children: [4, 5, 6],
  },
};

traverse(tree, {
  // If you provide an `after` callback, it will be called on the way *up*
  // the traversal stack; this is equivalent to a depth-first search.
  after: (value, path) => {
    console.log(`At '.${path.join(".")}':`, value);
  },
});
// Output:
//
// At '.type': 'Root'
// At '.left.type': 'Left'
// At '.left.children.0': 1
// At '.left.children.1': 2
// At '.left.children.2': 3
// At '.left.children': [ 1, 2, 3 ]
// At '.left': { type: 'Left', children: [ 1, 2, 3 ] }
// At '.right.type': 'Right'
// At '.right.children.0': 4
// At '.right.children.1': 5
// At '.right.children.2': 6
// At '.right.children': [ 4, 5, 6 ]
// At '.right': { type: 'Right', children: [ 4, 5, 6 ] }
// At '.': {
//   type: 'Root',
//   left: { type: 'Left', children: [ 1, 2, 3 ] },
//   right: { type: 'Right', children: [ 4, 5, 6 ] }
// }

traverse(tree, {
  // If you provide a `before` callback, it will be called on the way *down*
  // the traversal stack; this is equivalent to a breadth-first search.
  before: (value, path) => {
    console.log(`At '.${path.join(".")}':`, value);
  },
});
// Output:
//
// At '.': {
//   type: 'Root',
//   left: { type: 'Left', children: [ 1, 2, 3 ] },
//   right: { type: 'Right', children: [ 4, 5, 6 ] }
// }
// At '.type': Root
// At '.left': { type: 'Left', children: [ 1, 2, 3 ] }
// At '.left.type': Left
// At '.left.children': [ 1, 2, 3 ]
// At '.left.children.0': 1
// At '.left.children.1': 2
// At '.left.children.2': 3
// At '.right': { type: 'Right', children: [ 4, 5, 6 ] }
// At '.right.type': Right
// At '.right.children': [ 4, 5, 6 ]
// At '.right.children.0': 4
// At '.right.children.1': 5
// At '.right.children.2': 6
```

## API

This module has two named exports:

- A function named `traverse`
- A Symbol named `stop`

### `traverse`

The `traverse` function has the following type signature:

```ts
function traverse(
  tree: any,
  callbacks?: {
    before?: (value: any, path: Array<string | number>) => void | typeof stop;
    after?: (value: any, path: Array<string | number>) => void;
  },
): void;
```

Pass in any JSON-compatible value (the `tree` parameter) and callback function(s) (the `callbacks` parameter). Your `tree` will be searched through, and `callbacks.before` and `callbacks.after` will be called for each descendant in the tree.

When `callbacks.before` or `callbacks.after` gets called, it will be called with two arguments:

- The value of the current descendant (could be an object, an array, a string, a number, etc)
- The property path from the initially-passed `tree` object to this descendant (an array of strings or numbers)

### `stop`

You can return `stop` from a `before` callback passed into `traverse` to stop traversing downwards beyond the current object's children.

## Tips

- The `path` Array your callback receives is suitable for use in lodash's [`set`](https://lodash.com/docs/4.17.15#set) and [`get`](https://lodash.com/docs/4.17.15#get) functions. As such, you can use lodash's `set` function to mutate a tree while you traverse over it.

- If you want to create a new tree instead of mutating the existing one, you can combine lodash's `set` function with [immer](https://www.npmjs.com/package/immer).

## Troubleshooting

- If you're expecting an object property to be visited by `traverse`, but it isn't, make sure the property is an "own," "enumerable" property. For instance, class methods found on an instance of a class are not "own" properties, so `traverse` won't visit them. See [MDN's article on 'Enumerability and ownership of properties'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) for more info.

- The contents of `Map` and `Set` objects won't be visited by `traverse`, because it's only designed with JSON-compatible values in mind. However, the `Map`/`Set` _itself_ will be visited. As such, if you want to inspect the contents of a `Map`/`Set`, you can do so from within your callback. Alternatively, you can convert `Map`s/`Set`s in your tree into Objects or Arrays prior to passing your tree into `traverse`.

## License

MIT
