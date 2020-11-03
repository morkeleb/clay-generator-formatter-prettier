const prettier = require('prettier');
module.exports = {
    extensions: ['**/*.js', '**/*.jsx'],
    apply: function(content) {
        return prettier.format(content);
    }
}