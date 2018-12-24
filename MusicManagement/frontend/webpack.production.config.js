const path = require('path');
module.exports = {
    mode: 'production',
    entry: {
        app: [
            './src/music_app/music.js',
            './src/music_app/player_mini.js',
            './src/music_app/player.js',
            './src/music_app/playlist_view.js',
            './src/music_app/recommend.js',
            './src/music_app/search.js',
            './src/music_app/sidebar.js',
            './styles/music_app/player_mini.css',
            './styles/music_app/sidebar.css'
        ],
        adminApp: [
            './src/admin_app/notification.js',
            './src/admin_app/music_manage.js',
            './src/admin_app/navbar.js',
        ],
        public: [
            './src/base.js',
            './src/vendor.js',
            './src/public/django_pagination.js',
            './styles/global.css',
            './styles/animate.css'
        ]
    },
    output: {
        filename: './scripts/[name].bundle.js',
        path: path.resolve(__dirname, './dist/static')
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
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: './assets/',
                publicPath: '/dist/static/assets/'
            }
        }]
    }
};