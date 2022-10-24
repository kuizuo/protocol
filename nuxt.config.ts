import { defineNuxtConfig } from 'nuxt/config'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  runtimeConfig: {
    cookieName: process.env.COOKIE_NAME || '__session',
    cookieSecret: process.env.COOKIE_SECRET || 'secret',
    cookieExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || '86400000', 10), // 1 day
    cookieRememberMeExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || '86400000', 10), // 7 days
    jwtSecret: process.env.JWT_SECRET || 'secret',
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/content',
  ],
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
        sepia: 'monokai',
      },
    },
  },
  unocss: {
    uno: true,
    icons: true,
    attributify: true,
    preflight: false,
  },
  colorMode: {
    classSuffix: '',
  },
  imports: {
    dirs: [
      'composables',
      'composables/*/index.{ts,js,mjs,mts}',
      'composables/**',
      'stores/*/index.{ts,js,mjs,mts}',
      'stores/**',
    ],
  },
  experimental: {
    reactivityTransform: true,
    viteNode: true,
  },
  // https://github.com/nuxt/framework/issues/6204#issuecomment-1201398080
  hooks: {
    'vite:extendConfig': function (config: any, { isServer }: any) {
      if (isServer) {
        // Workaround for netlify issue
        // https://github.com/nuxt/framework/issues/6204
        config.build.rollupOptions.output.inlineDynamicImports = true
      }
    },
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer',
          ]
        : ['@juggle/resize-observer'],
  },
  vite: {
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : [],
    },
  },
})
