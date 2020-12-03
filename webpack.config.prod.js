const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const VueLoaderPlugin = require("vue-loader/lib/plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "assets/js/bulind.js",
	},
	module: {
		rules: [{
				test: /\.css$/i,
				use: [{
					loader: MiniCssExtractPlugin.loader,
					options: {
						publicPath: '../',
					}
				}, 'css-loader', "css-loader"],
			},

			{
				test: /\.s[ac]ss$/i,
				use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: './',
						}
					},
					{
						loader: 'css-loader'
					},
					{

						loader: 'sass-loader'
					}
				],
			},

			{
				test: /\.(jpg|png|webp|jpeg|svg)$/i,
				use: [{
					loader: "file-loader",
					options: {
						name: 'assets/img/[name].[ext]',
						publicPath: '../../'
					},
				}, ],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
		],
	},

	plugins: [

		new HtmlWebpackPlugin({

			template: "./src/index.html",
			filename: "index.html",
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: './assets/css/main.css',
		}),

		new CompressionPlugin({
			filename: "[path][base].gz",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8,
		}),
	],

	resolve: {
		alias: {
			vue$: "vue/dist/vue.js",
		},
	},
};