const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './client/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.client.json',
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
        ]
      },
      {
        test: /\.ya?ml$/,
        use: "yaml-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset', // 100kb 이하면 자동으로 base64 인라인, 크면 파일로
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024 // 100kb
          }
        }
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new webpack.DefinePlugin({
      API_BASE_URL: JSON.stringify(
        process.env.NODE_ENV === 'production'
          ? 'https://api.gaia.cc'
          : 'http://localhost:8080'
      )
    })
  ],
  mode: 'development'
};
