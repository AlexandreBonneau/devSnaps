// Import the environment variables
require('dotenv').config();

module.exports = {
    /*
    ** Headers of the page
    */
    head   : {
        title: 'DevSnaps',
        meta : [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Everyday solutions to everyday dev problems' },
        ],
        link : [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
        ],
    },
    plugins: ['~/plugins/vuetify.js'],
    css    : [
        '~/assets/style/app.styl',
    ],
    /*
    ** Customize the progress bar color
    */
    loading: { color: '#3f81c2' },
    /*
    ** Build configuration
    */
    build  : {
        vendor    : [
            '~/plugins/vuetify.js',
            'axios',
        ],
        extractCSS: true,
        /*
        ** Run ESLint on save
        */
        extend(config, ctx) {
            if (ctx.dev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test   : /\.(js|vue)$/,
                    loader : 'eslint-loader',
                    exclude: /(node_modules)/,
                });
            }
        },
    },
    env: {
        protocol: process.env.BACKEND_HTTP_HTTPS || 'http',
        host    : process.env.BACKEND_HOST || 'localhost',
        port    : process.env.BACKEND_PORT || '4242',
        baseUrl : `${process.env.BACKEND_HTTP_HTTPS}://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`,
    },
};
