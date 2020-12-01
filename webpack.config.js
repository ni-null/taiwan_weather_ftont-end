const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "./bulind.js",
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},

			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},

			{
				test: /\.(jpg|png|webp|jpeg|svg)$/i,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 1000, //bytes
							name: "[hash:7].[ext]",
							outputPath: "assets",
						},
					},
				],
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
		// 創建實例 (第二步)
		new HtmlWebpackPlugin({
			// 配置 HTML 模板路徑與生成名稱 (第三步)
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
