module.exports = {
  extends: ['airbnb'],
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  env: {
    browser: true,
  },
  rules: {
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-underscore-dangle': 0,
    'no-continue': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
  },
};
