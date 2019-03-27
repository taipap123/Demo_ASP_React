var path = require('path');
var webpack = require('webpack');
var config = {
    entry: {
        md_lstprovince: './components/category/md_province/md_province.js',
    },
    output: {
        path: path.join(__dirname, "bundles"),
        filename: "[name].bundle.js"
    },

    module: {
		rules: [
			{
				use : 'babel-loader',
				test : /\.(js|jsx)$/,
				exclude : /node_modules/
			},
			{
				use : [
					'style-loader',
					'css-loader'
				],
				test :/\.css$/
			},
			
		],
    },
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
   
}
module.exports = config;