const path = require("path")
const webpack = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin")

//vue loader
const VueLoaderPlugin = require("vue-loader/lib/plugin")

//css分離
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

//gzip
const CompressionPlugin = require("compression-webpack-plugin")

//js壓縮 不和 MiniCssExtractPlugin 相容
const TerserPlugin = require("terser-webpack-plugin")

//清除建構資料夾
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = {
  externals: ["moment"],

  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "./assets/js/[name]-[hash:6].js",
  },

  //關閉警告
  performance: {
    hints: false,
  },

  optimization: {
    usedExports: true,
    sideEffects: false,
    minimize: true,
    minimizer: [
      //壓縮

      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
      new CssMinimizerPlugin({ test: /\.s[ac]ss$/i }),
    ],
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 300000,
      name: "other",

      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.s?css$/,
          chunks: "all",
          reuseExistingChunk: true,
          enforce: true,
        },
        comm: {
          test: /[\\/]node_modules[\\/]/,
          name: "comm",
          minChunks: 2,
          priority: 1,
        },

        src: {
          test: /[\\/]src[\\/]img[\\/]svg[\\/]static_icon|weather_svg[\\/]/,
          name: "weather_svg",
          priority: 30,
        },

        vue: {
          test: /[\\/]node_modules[\\/](axios).*|(vue).*|(vue-router).*[\\/]/,
          chunks: "initial",
          name: "vue",
          priority: 5,
        },

        D3: {
          test: /[\\/]node_modules[\\/](d3).*[\\/]/,
          name: "D3",
          priority: 40,
          enforce: true,
        },

        chartjs: {
          test: /[\\/]node_modules[\\/](chart).*[\\/]/,
          name: "Chart",
          priority: 40,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,

            options: {
              publicPath: "../",
            },
          },
          "css-loader",
          "css-loader",
        ],
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {
            esModule: false,
            encoding: "base64",
            outputPath: "assets",
          },
        },
      },
      {
        test: /\.(jpg|png|webp|jpeg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name: "assets/img/[name].[hash:4].[ext]",
              publicPath: "../../",
            },
          },
        ],
      },

      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },

  plugins: [
    //打包分析
    new BundleAnalyzerPlugin(),

    //刪除dist資料夾
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),

    //vue解析
    new VueLoaderPlugin(),

    //拆分css
    new MiniCssExtractPlugin({
      filename: "./assets/css/[name].[hash:6].css",
    }),

    //壓縮
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
}
