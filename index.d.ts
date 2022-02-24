declare function traverse(
  tree: any,
  callback: (value: any, path: Array<string | number>) => void
): void;

export = traverse;
