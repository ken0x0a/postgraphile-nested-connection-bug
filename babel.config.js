module.exports = function(api) {
  api.cache(false)
  return {
    compact: false,
    presets: ['@babel/preset-typescript', ['@babel/preset-env', { modules: 'auto' }]],
    plugins: [
      // '@babel/plugin-transform-modules-commonjs',
      // '@babel/plugin-transform-destructuring',
      // '@babel/plugin-transform-regenerator',
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      // '@babel/plugin-proposal-decorators',
      '@babel/plugin-proposal-class-properties',
      // '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-bigint',
      // 'import-graphql',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            src: './src',
          },
        },
      ],
    ],
    env: {
      production: {
        compact: true,
      },
    },
  }
}
