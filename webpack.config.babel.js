import path from 'path';

export default () => ({
	mode: 'production',
	entry: './src/Sushi.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'sushi.js',
		library: 'Sushi',
		libraryTarget: 'umd',
		libraryExport: 'default',
		globalObject: 'this'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/env'
						]
					}
				}
			}
		]
	},
	externals: {
		'formula-values': 'formula-values',
		'moment': 'moment'
	}
});
