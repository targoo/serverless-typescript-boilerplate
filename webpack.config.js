const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],
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
