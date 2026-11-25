const path = require('path');
const prettier = require('prettier');

const organizeImports = require.resolve('prettier-plugin-organize-imports');

// Prettier 3 resolves a config's plugin names from the process's working
// directory; the generator runs from the repo root, the plugins live beside
// the generated file's package.
const resolvePlugin = (plugin, filePath) =>
  typeof plugin === 'string'
    ? require.resolve(plugin, { paths: [path.dirname(filePath)] })
    : plugin;

module.exports = {
  extensions: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  apply: async function (filePath, content) {
    const { plugins = [], ...options } =
      (await prettier.resolveConfig(filePath)) || {};
    // Two passes: prettier-plugin-tailwindcss replaces the TypeScript parser
    // and only defers to organize-imports when it can resolve it from its own
    // package, which admin and shop do not install.
    const organized = await prettier.format(content, {
      ...options,
      filepath: filePath,
      plugins: [organizeImports],
    });
    if (plugins.length === 0) return organized;
    return prettier.format(organized, {
      ...options,
      filepath: filePath,
      plugins: plugins.map(plugin => resolvePlugin(plugin, filePath)),
    });
  },
};
