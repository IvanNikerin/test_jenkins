var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

var devServer = new WebpackDevServer(
	webpack(config),
	{
		contentBase: __dirname,
		publicPath: '/assets/',
		proxy: {
        	'/tobox/*': 'http://127.0.0.1:9090',
          '/importer/*': 'http://127.0.0.1:9090',
    	},
    	stats: { 
    		colors: true
    	}
	}
).listen(8080, 'localhost');

var express = require('express');
var url = require('url');
var proxy = require('proxy-middleware');

var app = express();

app.use('/tobox', proxy(Object.assign(
  	{},
  	url.parse('http://web.tobox.ru/'),
  	{preserveHost: true}
)));

app.use('/importer', proxy(Object.assign(
    {},
    url.parse('http://127.0.0.1:8000/'),
    {preserveHost: true}
)));

app.listen(9090, function () {
});