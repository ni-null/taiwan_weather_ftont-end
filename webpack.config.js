const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
	mode: 'development',
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "./bulind.js",
	},
	module: {
		rules: [{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},

			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},

			{
				test: /\.(jpg|png|webp|jpeg|svg)$/i,
				use: [{
					loader: "url-loader",
					options: {
						name: "[hash:7].[ext]",
						outputPath: "assets",
						esModule: false
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
	],

	resolve: {
		alias: {
			vue$: "vue/dist/vue.js",
		},
	},
};