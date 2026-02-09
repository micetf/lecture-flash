const path = require("path");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env, argv) => {
    const isDev = () => argv.mode === "development";

    const entry = "./src/index.js";

    const output = {
        path: path.resolve(__dirname, "build"),
        filename: "js/[name].bundle.js",
        chunkFilename: "js/[name].bundle.js",
    };

    const devServer = {
        static: path.resolve(__dirname, "build"),
        compress: true,
        port: 9000,
        open: true,
    };

    const optimization = {
        minimizer: [
            (compiler) => {
                const TerserPlugin = require("terser-webpack-plugin");
                new TerserPlugin({
                    terserOptions: {
                        compress: {},
                    },
                }).apply(compiler);
            },
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    },
                },
            }),
        ],
        splitChunks: {
            cacheGroups: {
                react: {
                    test: /[\\/]node_modules[\\/]((react).*)[\\/]/,
                    name: "react",
                    chunks: "all",
                },
                commons: {
                    test: /[\\/]node_modules[\\/]((?!react).*)[\\/]/,
                    name: "common",
                    chunks: "all",
                },
            },
        },
    };

    const devtool = isDev() ? "cheap-module-source-map" : "source-map";

    const module = {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                [
                                    "@babel/preset-react",
                                    { development: isDev() },
                                ],
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    MiniCSSExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: ["postcss-preset-env"],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff2?|eot|ttf|otf|wav)(\?.*)?$/,
                loader: "file-loader",
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            fallback: "file-loader",
                            name: "img/[name].bundle.[ext]",
                        },
                    },
                    {
                        loader: "img-loader",
                        options: {
                            enabled: !isDev(),
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                    },
                ],
            },
        ],
    };

    const plugins = [
        new CleanWebpackPlugin(),
        new MiniCSSExtractPlugin({
            filename: "css/[name].bundle.css",
        }),
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            defaultSizes: "gzip",
            analyzerMode: "static",
            reportFilename: "../report.html",
        }),
    ];

    return {
        entry,
        output,
        devServer,
        optimization,
        devtool,
        module,
        plugins,
    };
};
