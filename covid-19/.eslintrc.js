module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
        "extends": [
            "airbnb-base",
            "prettier"
        ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": "off",
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        'class-methods-use-this': 'off',
        "prefer-destructuring": ["error", {
            "array": false,
            "object": false
          }, {
            "enforceForRenamedProperties": false
          }]
    }
};
