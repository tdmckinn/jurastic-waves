
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import mongoose from 'mongoose';

import webpack from 'webpack';
import webpackConfig from '../webpack.config';
import WebpackDevServer from 'webpack-dev-server';

import schema from './data/schema';

const APP_PORT = 7777;
const GRAPHQL_PORT = 8080;

const rootPath = path.join(__dirname);
const publicPath = path.join(rootPath, '../dist');
const config = webpackConfig({ dev: true, APP_PORT, rootPath });
const compiler = webpack(config);
const graphQLServer = express();

// Connect to the mongo database
mongoose.connect('mongodb://127.0.0.1:27017/test');

graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema
}));

graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL server is now
    running on http://localhost:${GRAPHQL_PORT}`);
});

const app = new WebpackDevServer(compiler, {
  contentBase: '../client/',
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true },
  historyApiFallback: true
});

// static
app.use(express.static(publicPath));
// app.use('/assets', express.static(__dirname + '/assets'))

app.listen(APP_PORT, () => {
  console.log(`Jurassic-Waves is now running on http://localhost:${APP_PORT}`);
});
