import { describe, test, beforeEach, afterEach, expect } from "vitest";
import util from "node:util";
import traverse from "./index";

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
  another: function someFunction(_a: any, _b: any, _c: any) {
    return true;
  },
  get dontCallThis() {
    throw new Error("do not throw souls!!");
  },
};

test("basic before", () => {
  const messages: Array<any> = [];

  traverse(tree, {
    before: (value, path) => {
      messages.push(
        ...[
          //
          `At '.${path.join(".")}':`,
          "\n",
          util.inspect(value),
          "\n",
          "\n",
        ]
      );
    },
  });

  expect(messages.join("").trim()).toMatchInlineSnapshot(`
    At '.':
    {
      type: 'Root',
      left: { type: 'Left', children: [ 1, 2, 3 ] },
      right: { type: 'Right', children: [ 4, 5, 6 ] },
      another: [Function: someFunction],
      dontCallThis: [Getter]
    }

    At '.type':
    'Root'

    At '.left':
    { type: 'Left', children: [ 1, 2, 3 ] }

    At '.left.type':
    'Left'

    At '.left.children':
    [ 1, 2, 3 ]

    At '.left.children.0':
    1

    At '.left.children.1':
    2

    At '.left.children.2':
    3

    At '.right':
    { type: 'Right', children: [ 4, 5, 6 ] }

    At '.right.type':
    'Right'

    At '.right.children':
    [ 4, 5, 6 ]

    At '.right.children.0':
    4

    At '.right.children.1':
    5

    At '.right.children.2':
    6

    At '.another':
    [Function: someFunction]

    At '.another.length':
    3

    At '.another.name':
    'someFunction'

    At '.another.arguments':
    null

    At '.another.caller':
    null

    At '.another.prototype':
    {}
  `);
});

test("before with stop", () => {
  const messages: Array<any> = [];

  traverse(tree, {
    before: (value, path) => {
      messages.push(
        ...[
          //
          `At '.${path.join(".")}':`,
          "\n",
          util.inspect(value),
          "\n",
          "\n",
        ]
      );

      if (path[path.length - 1] === "left") {
        return traverse.stop;
      }
    },
  });

  expect(messages.join("").trim()).toMatchInlineSnapshot(`
    At '.':
    {
      type: 'Root',
      left: { type: 'Left', children: [ 1, 2, 3 ] },
      right: { type: 'Right', children: [ 4, 5, 6 ] },
      another: [Function: someFunction],
      dontCallThis: [Getter]
    }

    At '.type':
    'Root'

    At '.left':
    { type: 'Left', children: [ 1, 2, 3 ] }

    At '.right':
    { type: 'Right', children: [ 4, 5, 6 ] }

    At '.right.type':
    'Right'

    At '.right.children':
    [ 4, 5, 6 ]

    At '.right.children.0':
    4

    At '.right.children.1':
    5

    At '.right.children.2':
    6

    At '.another':
    [Function: someFunction]

    At '.another.length':
    3

    At '.another.name':
    'someFunction'

    At '.another.arguments':
    null

    At '.another.caller':
    null

    At '.another.prototype':
    {}
  `);
});

test("basic after", () => {
  const messages: Array<any> = [];

  traverse(tree, {
    after: (value, path) => {
      messages.push(
        ...[
          //
          `At '.${path.join(".")}':`,
          "\n",
          util.inspect(value),
          "\n",
          "\n",
        ]
      );
    },
  });

  expect(messages.join("").trim()).toMatchInlineSnapshot(`
    At '.type':
    'Root'

    At '.left.type':
    'Left'

    At '.left.children.0':
    1

    At '.left.children.1':
    2

    At '.left.children.2':
    3

    At '.left.children':
    [ 1, 2, 3 ]

    At '.left':
    { type: 'Left', children: [ 1, 2, 3 ] }

    At '.right.type':
    'Right'

    At '.right.children.0':
    4

    At '.right.children.1':
    5

    At '.right.children.2':
    6

    At '.right.children':
    [ 4, 5, 6 ]

    At '.right':
    { type: 'Right', children: [ 4, 5, 6 ] }

    At '.another.length':
    3

    At '.another.name':
    'someFunction'

    At '.another.arguments':
    null

    At '.another.caller':
    null

    At '.another.prototype':
    {}

    At '.another':
    [Function: someFunction]

    At '.':
    {
      type: 'Root',
      left: { type: 'Left', children: [ 1, 2, 3 ] },
      right: { type: 'Right', children: [ 4, 5, 6 ] },
      another: [Function: someFunction],
      dontCallThis: [Getter]
    }
  `);
});

test("before and after", () => {
  const messages: Array<any> = [];

  traverse(tree, {
    before: (value, path) => {
      messages.push(
        ...[
          //
          `Before at '.${path.join(".")}':`,
          "\n",
          util.inspect(value),
          "\n",
          "\n",
        ]
      );
    },
    after: (value, path) => {
      messages.push(
        ...[
          //
          `After at '.${path.join(".")}':`,
          "\n",
          util.inspect(value),
          "\n",
          "\n",
        ]
      );
    },
  });

  expect(messages.join("").trim()).toMatchInlineSnapshot(`
    Before at '.':
    {
      type: 'Root',
      left: { type: 'Left', children: [ 1, 2, 3 ] },
      right: { type: 'Right', children: [ 4, 5, 6 ] },
      another: [Function: someFunction],
      dontCallThis: [Getter]
    }

    Before at '.type':
    'Root'

    After at '.type':
    'Root'

    Before at '.left':
    { type: 'Left', children: [ 1, 2, 3 ] }

    Before at '.left.type':
    'Left'

    After at '.left.type':
    'Left'

    Before at '.left.children':
    [ 1, 2, 3 ]

    Before at '.left.children.0':
    1

    After at '.left.children.0':
    1

    Before at '.left.children.1':
    2

    After at '.left.children.1':
    2

    Before at '.left.children.2':
    3

    After at '.left.children.2':
    3

    After at '.left.children':
    [ 1, 2, 3 ]

    After at '.left':
    { type: 'Left', children: [ 1, 2, 3 ] }

    Before at '.right':
    { type: 'Right', children: [ 4, 5, 6 ] }

    Before at '.right.type':
    'Right'

    After at '.right.type':
    'Right'

    Before at '.right.children':
    [ 4, 5, 6 ]

    Before at '.right.children.0':
    4

    After at '.right.children.0':
    4

    Before at '.right.children.1':
    5

    After at '.right.children.1':
    5

    Before at '.right.children.2':
    6

    After at '.right.children.2':
    6

    After at '.right.children':
    [ 4, 5, 6 ]

    After at '.right':
    { type: 'Right', children: [ 4, 5, 6 ] }

    Before at '.another':
    [Function: someFunction]

    Before at '.another.length':
    3

    After at '.another.length':
    3

    Before at '.another.name':
    'someFunction'

    After at '.another.name':
    'someFunction'

    Before at '.another.arguments':
    null

    After at '.another.arguments':
    null

    Before at '.another.caller':
    null

    After at '.another.caller':
    null

    Before at '.another.prototype':
    {}

    After at '.another.prototype':
    {}

    After at '.another':
    [Function: someFunction]

    After at '.':
    {
      type: 'Root',
      left: { type: 'Left', children: [ 1, 2, 3 ] },
      right: { type: 'Right', children: [ 4, 5, 6 ] },
      another: [Function: someFunction],
      dontCallThis: [Getter]
    }
  `);
});

describe("when WeakSet isn't available", () => {
  let realWeakSet: any;
  beforeEach(() => {
    realWeakSet = WeakSet;
    // @ts-ignore The operand of a 'delete' operator must be optional. ts(2790)
    delete global.WeakSet;
  });
  afterEach(() => {
    global.WeakSet = realWeakSet;
  });

  test("still works okay", () => {
    const messages: Array<any> = [];

    expect(() => {
      traverse(tree, {
        before: (value, path) => {
          messages.push([value, path]);
        },
      });
    }).not.toThrow();

    expect(messages.length).toBeGreaterThan(0);
  });
});
