import path from 'path';

let webConf = {
	mode: 'production',
	entry: './src/Sushi.js',
	target: 'web',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'sushi.js',
		library: 'Sushi',
		libraryTarget: 'umd',
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
		'moment': {
			commonjs: 'moment',
			commonjs2: 'moment',
			amd: 'moment',
			root: 'moment'
		}
	}
};

export default () => (webConf);
