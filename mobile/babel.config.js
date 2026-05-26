module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@constants': './src/constants',
            '@store': './src/store',
            '@services': './src/services',
            '@types': './src/types',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
