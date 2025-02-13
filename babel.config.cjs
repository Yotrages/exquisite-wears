module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }], // or manual if you prefer
    '@babel/preset-typescript'
  ],
};
