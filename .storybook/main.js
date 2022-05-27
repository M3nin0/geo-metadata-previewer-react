module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-jest',
    'storybook-addon-mock/register',
  ],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    // see: https://stackoverflow.com/questions/70036039/react-storybook-not-running-after-installation-of-react-leaflet-version-3
    config.module.rules.push({
      test: /\.jsx?$/,
      exclude: (filename) => {
        return /node_modules/.test(filename) && !/react-leaflet/.test(filename);
      },
      loader: require.resolve('babel-loader'),
      options: {
        plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
      },
    });

    return config;
  },
};
