import path from 'path';

export default () => ({
	entry: './src/Sushi.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'sushi.js',
		libraryTarget: 'umd',
		library: 'Sushi'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	externals: {
		'FormulaValues': 'formula-values',
		'moment': 'moment'
	}
});