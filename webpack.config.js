const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [
    nodeExternals({
      //      modulesFromFile: true, // Read the modules from the package.json file instead of the node_modules folder
    }),
  ],
  optimization: {
    // We no not want to minimize our code.
    minimize: false,
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: __dirname,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.tsx?$/,
        include: __dirname,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  plugins: [new FriendlyErrorsWebpackPlugin()],
};
