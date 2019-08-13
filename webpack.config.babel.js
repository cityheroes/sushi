import path from 'path';

let serverConf = {
	mode: 'production',
	entry: './src/Sushi.js',
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'sushi.js',
		libraryTarget: 'umd',
		library: 'Sushi'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map',
	externals: {
		'underscore': 'underscore',
		'moment': 'moment'
	}
};

let webConf = {
	mode: 'production',
	entry: './src/Sushi.js',
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'sushi.web.js',
		libraryTarget: 'var',
		library: 'Sushi',
		libraryExport: 'default'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map',
	externals: {
		'underscore': '_',
		'moment': 'moment'
	}
};

export default [serverConf, webConf];
