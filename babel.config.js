module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "modules": "commonjs"
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-regenerator',
    ['@babel/plugin-transform-spread', {
      loose: true
    }],
    ['@babel/plugin-transform-runtime', {
      helpers: true,
      regenerator: true
    }]
  ]
};
