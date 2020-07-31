const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, '../server/src/public/javascripts'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              publicPath: '../image',
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // entry
      filename: '../../views/index.html', // output(main.js 기준)
    }),
  ],
};
