const path = require('path');
module.exports = {
    entry: {
        app: ['./src/base.js', './src/index.js', './src/navbar.js', './src/music_manage.js', './src/music.js', './src/recommend.js', './src/search.js', './src/player.js', './src/player_mini.js', './src/sidebar.js'],
        style: ['./styles/global.css']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'file-loader'
        },
        {
            test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            loader: 'file-loader'
        }
        ]
    }
};