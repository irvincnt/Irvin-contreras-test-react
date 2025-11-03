const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

const envFile = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
);

const isProd = process.env.NODE_ENV === 'production';

dotenv.config({ path: envFile });

const { ModuleFederationPlugin } = webpack.container;

const DEFAULT_HOST_REMOTE_URL = 'http://localhost:3000/remoteEntry.js';
const DEFAULT_PUBLIC_PATH = isProd ? 'auto' : 'http://localhost:3002/';

const HOST_REMOTE_URL = process.env.HOST_REMOTE_URL ?? DEFAULT_HOST_REMOTE_URL;
const PUBLIC_PATH = process.env.PUBLIC_PATH ?? DEFAULT_PUBLIC_PATH;

module.exports = {
  entry: './src/index.ts',
  mode: isProd ? 'production' : 'development',
  devServer: {
    port: 3002,
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    publicPath: PUBLIC_PATH,
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'products',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductsApp': './src/App',
      },
      remotes: {
        host: `host@${HOST_REMOTE_URL}`,
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

