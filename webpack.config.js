// webpack.config.js
module.exports = {
    entry: './src/panel/GraphPanel.js',
    output: {
        filename: 'graph-label-tool.js'
    },
    module: {
        // rules: [
        //     {
        //         test: /\.js$/,
        //         exclude: /node_modules/,
        //         use: {
        //             loader: 'babel-loader',
        //             options: {
        //                 presets: ['@babel/preset-env']
        //             }
        //         },
        //
        //     }
        // ]
    },
    //mode: 'development',    //开发模式,编译会快很多
    devtool: '#inline--source-map',   //调试的时候, 可以链接到源文件, 查看到底是原来那个js出错了
    optimization:{
        minimize: false, // <---- 阻止压缩代码,这样可以保留原来的行和变量名
        // minimizer: [new UglifyJsPlugin()] if you want to customize it.
    }
};