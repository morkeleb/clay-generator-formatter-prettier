const prettier = require('prettier');
module.exports = {
    extensions: ['**/*.js', '**/*.jsx'],
    apply: async function(file_path, content) {
        const options = await  prettier.resolveConfig(file_path);
        return prettier.format(content, {filepath: file_path, ...options});
    }
}