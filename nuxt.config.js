export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'bnb42',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    script: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js',
      },
    ],
  },

  publicRuntimeConfig: {
    marketContract: process.env.VUE_APP_MARKET_CONTRACT,
    networkId: Number(process.env.VUE_APP_NETWORK_ID),
    infuraId: process.env.VUE_APP_INFURA_ID,
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/styles/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/directives/click-outside'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/device',
    '@nuxtjs/svg-sprite',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],
  device: {
    refreshOnResize: true,
  },
  // SVG sprite module https://github.com/nuxt-community/svg-sprite-module
  svgSprite: {
    input: '~/assets/sprite/svg',
    output: '~/assets/sprite/gen',
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      sass: {
        implementation: require('sass'),
      },
      scss: {
        implementation: require('sass'),
      },
    },
  },

  server: {
    host: process.env.VUE_APP_HOST || '0.0.0.0',
    port: process.env.VUE_APP_PORT || '3000',
    timing: false,
  },
};
