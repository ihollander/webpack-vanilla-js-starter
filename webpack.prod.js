const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		main: './src/index.js'
	},
	output: {
		// use a content hash for cache busting to force browsers to re-download our code when the contents of the files change
		filename: '[name].[contentHash].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	// additional optimization options for building production code
	// js minification is enabled by default
	optimization: {
		minimizer: [
			// minify css
			new OptimizeCssAssetsPlugin(),
			// minify js
			new TerserWebpackPlugin(),
			// minify html
			new HtmlWebpackPlugin({
				templateParameters: { PROJECT_NAME: 'webpack-vanilla-js-starter' },
				template: './public/index.html',
				minify: {
					removeAttributeQuotes: true,
					collapseWhitespace: true,
					removeComments: true
				}
			})
		],
		runtimeChunk: 'single',
		moduleIds: 'hashed',
		// lets us separate out the vendor code from our dependencies (node_modules)
		// so we'll serve separate files for our code and our dependencies 
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\/]node_modules[\/]/,
					name: 'vendor',
					chunks: 'all'
				}
			}
		}
	},
	plugins: [
		// extract css to file instead of <style> tags
		// helps with browser caching
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css'
		}),
		// remove old files from our build directory
		new CleanWebpackPlugin(),
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
				test: /\.(css|scss)$/i,
				use: [
					MiniCssExtractPlugin.loader, // 3. inject the css from javascript into a <style> tag
					'css-loader', // 2. take the css and convert to javascript
					'sass-loader' // 1. if it's an scss file, first compile the css
				]
			},
			{
				test: /\.html$/i,
				use: ['html-loader']
			},
			{
				test: /\.(svg|png|jpg|gif)$/i, // lets us import files with these types in our js files
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[hash].[ext]',
						outputPath: 'images'
					}
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader' // use babel to transpile our js code; settings are in the .babelrc file
			}
		]
	}
};
