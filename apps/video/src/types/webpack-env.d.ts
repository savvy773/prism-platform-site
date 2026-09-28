// Minimal typing for webpack's require.context, which Remotion's bundler supports.
declare const require: {
  context(
    directory: string,
    recursive: boolean,
    pattern: RegExp,
  ): { keys(): string[]; (id: string): unknown };
};
