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

const AUTH_STORAGE_SECRET = process.env.AUTH_STORAGE_SECRET ?? '';

const REMOTE_RICK_MORTY_URL = process.env.REMOTE_RICK_MORTY_URL ?? 'http://localhost:3001/remoteEntry.js';
const REMOTE_PRODUCTS_URL = process.env.REMOTE_PRODUCTS_URL ?? 'http://localhost:3002/remoteEntry.js';
const REMOTE_UPLOAD_URL = process.env.REMOTE_UPLOAD_URL ?? 'http://localhost:3003/remoteEntry.js';

module.exports = {
  entry: './src/index.ts',
  mode: isProd ? 'production' : 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  output: {
    publicPath: isProd ? 'auto' : process.env.HOST_URL ?? 'http://localhost:3000/',
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
      name: 'host',
      exposes: {
        './AuthStore': './src/store/authStore',
      },
      remotes: {
        rickMorty: `rickMorty@${REMOTE_RICK_MORTY_URL}`,
        products: `products@${REMOTE_PRODUCTS_URL}`,
        upload: `upload@${REMOTE_UPLOAD_URL}`,
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
      },
    }),
    new webpack.DefinePlugin({
      'process.env.AUTH_STORAGE_SECRET': JSON.stringify(AUTH_STORAGE_SECRET),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

