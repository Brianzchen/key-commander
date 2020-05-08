const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { browsers: ['last 2 versions', 'safari >= 7'] },
      },
    ],
    '@babel/preset-flow',
  ],
};

module.exports = config;
