const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'none', // change the js output format for easier debugging
	entry: {
		main: './src/index.js'
	},
	plugins: [
		// takes a template html file and injects script tags with our bundled assts
		new HtmlWebpackPlugin({
			templateParameters: {
				PROJECT_NAME: 'webpack-vanilla-js-starter'
			},
			template: './public/index.html'
		}),
		// copy files from the public directory to our build directory
		new CopyWebpackPlugin([
			{
				from: 'public',
				to: './',
				toType: 'dir',
				ignore: ['.DS_Store', 'index.html'] // ignore index.html because HtmlWebpackPlugin will build it for us
			}
		])
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				use: 'html-loader'
			},
			{
				test: /\.(svg|png|jpg|gif)$/i,
				use: {
					loader: 'file-loader', // lets us import files with these types in our js files
					options: {
						name: '[name].[hash].[ext]', // rename files based on a content hash for cache busting
						outputPath: 'images'
					}
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader' // use babel to transpile our js code; settings are in the .babelrc file
			},
			{
				test: /\.(css|scss)$/i,
				use: [
					'style-loader', // 3. inject the css from javascript into a <style> tag
					'css-loader', // 2. take the css and convert to javascript
					'sass-loader' // 1. if it's an scss file, first compile the css
				]
			}
		]
	}
};
