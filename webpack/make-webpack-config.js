var path = require("path");
var fs = require("fs");
var yaml = require('js-yaml');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsPlugin = require("stats-webpack-plugin");
var loadersByExtension = require("./helpers/loadersByExtension");
var appConfig = yaml.safeLoad(fs.readFileSync('config.yml'));
var ROOT = path.join(__dirname, "..", "jsbeavy");

module.exports = function(options) {
	var entry = {
		// main: options.prerender ? "./config/mainPrerenderer" : "./config/mainApp"

    'main': ['./jsbeavy/main.jsx'],
		// second: options.prerender ? "./config/secondPrerenderer" : "./config/secondApp"
	};
	var loaders = {
		"jsx": options.hotComponents ? ["react-hot-loader", "babel-loader?stage=0"] : "babel-loader?stage=0",
		"js": {
			loader: "babel-loader?stage=0",
			include: ROOT
		},
		"json": "json-loader",
		"coffee": "coffee-redux-loader",
		"json5": "json5-loader",
		"txt": "raw-loader",
		"png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
		"woff|woff2": "url-loader?limit=100000",
		"ttf|eot": "file-loader",
		"wav|mp3": "file-loader",
		"html": "html-loader",
		"md|markdown": ["html-loader", "markdown-loader"]
	};
	var cssLoader = options.minimize ? "css-loader?module" : "css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]";
	var stylesheetLoaders = {
		"css": cssLoader,
		// "less": [cssLoader, "less-loader"],
		"styl": [cssLoader, "stylus-loader"],
		"scss|sass": [cssLoader, "sass-loader" +
			// highest priority: __CUSTOM/styles
			"?includePaths[]=" + encodeURIComponent(path.resolve(ROOT, "__CUSTOM", "styles")) +
			// second: App
			"&includePaths[]=" + encodeURIComponent(path.resolve(ROOT, "config", "apps", appConfig.FRONTEND, "styles")) +
			// third: defaults
			"&includePaths[]=" + encodeURIComponent(path.resolve(ROOT, "styles"))]
	};
	var additionalLoaders = [
		// { test: /some-reg-exp$/, loader: "any-loader" }
	];
	var alias = {

	};
	var aliasLoader = {

	};
	var externals = [

	];
	var modulesDirectories = ["web_modules", "node_modules"];
	var extensions = ["", ".web.js", ".js", ".jsx"];
	var root = ROOT;
	var publicPath = options.devServer ?
		"http://localhost:2992/_assets/" :
		"/_assets/";
	var output = {
		path: path.join(__dirname, "build", options.prerender ? "prerender" : "public"),
		publicPath: publicPath,
		filename: "[name].js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
		chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
		sourceMapFilename: "debugging/[file].map",
		libraryTarget: options.prerender ? "commonjs2" : undefined,
		pathinfo: options.debug || options.prerender
	};
	var excludeFromStats = [
		/node_modules[\\\/]react(-router)?[\\\/]/,
		/node_modules[\\\/]items-store[\\\/]/
	];
	var plugins = [
		new webpack.PrefetchPlugin("react"),
		new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
		new webpack.DefinePlugin({
				__DEBUG__    : !!options.debug,
				__REDUX_DEV_TOOLS__: !!options.redux_dev_tools,
  			__DEBUG_NW__ : !!options.redux_dev_tools}),
	];
	if(options.prerender) {
		plugins.push(new StatsPlugin(path.join(__dirname, "build", "stats.prerender.json"), {
			chunkModules: true,
			exclude: excludeFromStats
		}));
		aliasLoader["react-proxy$"] = "react-proxy/unavailable";
		aliasLoader["react-proxy-loader$"] = "react-proxy-loader/unavailable";
		externals.push(
			/^react(\/.*)?$/,
			/^reflux(\/.*)?$/,
			"superagent",
			"async"
		);
		plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
	} else {
		plugins.push(new StatsPlugin(path.join(__dirname, "build", "stats.json"), {
			chunkModules: true,
			exclude: excludeFromStats
		}));
	}
	if(options.commonsChunk) {
		plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "")));
	}

	Object.keys(stylesheetLoaders).forEach(function(ext) {
		var stylesheetLoader = stylesheetLoaders[ext];
		if(Array.isArray(stylesheetLoader)) stylesheetLoader = stylesheetLoader.join("!");
		if(options.prerender) {
			stylesheetLoaders[ext] = stylesheetLoader.replace(/^css-loader/, "css-loader/locals");
		} else if(options.separateStylesheet) {
			stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", stylesheetLoader);
		} else {
			stylesheetLoaders[ext] = "style-loader!" + stylesheetLoader;
		}
	});
	if(options.separateStylesheet && !options.prerender) {
		plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
	}
	if(options.minimize && !options.prerender) {
		plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compressor: {
					warnings: false
				}
			}),
			new webpack.optimize.DedupePlugin()
		);
	}
	if(options.minimize) {
		plugins.push(
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify("production")
				}
			}),
			new webpack.NoErrorsPlugin()
		);
	}

	return {
		entry: entry,
		output: output,
		target: options.prerender ? "node" : "web",
		module: {
			loaders: [].concat(loadersByExtension(loaders)).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
		},
		devtool: options.devtool,
		debug: options.debug,
		resolveLoader: {
			root: path.join(__dirname, "node_modules"),
			alias: aliasLoader
		},
		externals: externals,
		resolve: {
			root: root,
			modulesDirectories: modulesDirectories,
			extensions: extensions,
			alias: alias
		},
		plugins: plugins,
		devServer: {
	    contentBase: "./assets/",
	    publicPath: "/assets/",
	    proxy : {"*": "http://127.0.0.1:5000/"},
			stats: {
				cached: false,
				exclude: excludeFromStats
			}
		}
	};
};