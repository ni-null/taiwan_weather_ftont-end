const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

//vue loader
const VueLoaderPlugin = require("vue-loader/lib/plugin");

//css分離
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//gzip
const CompressionPlugin = require("compression-webpack-plugin");

//js壓縮 不和 MiniCssExtractPlugin 相容
const TerserPlugin = require("terser-webpack-plugin");


module.exports = {

	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "assets/js/bulind.[hash:6].js",
	},


	//關閉警告
	performance: {
		hints: false
	},

	optimization: {
		usedExports: true,
		sideEffects: false,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true // CPU数量 可输入 false true
			})
		],
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
				test: /\.svg/,
				use: {
					loader: "svg-url-loader",
					options: {
						// make all svg images to work in IE

						esModule: false,
						encoding: "base64",
						outputPath: "assets",

					},
				},
			},
			{
				test: /\.(jpg|png|webp|jpeg)$/i,
				use: [{
					loader: 'thread-loader',
				}, {
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
				include: path.resolve(__dirname, "src"),
				use: [{
						loader: 'thread-loader',

					},
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]

						},

					}
				]
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
			filename: './assets/css/main.[hash:6].css',
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