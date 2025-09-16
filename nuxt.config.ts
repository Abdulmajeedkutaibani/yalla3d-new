// nuxt.config.ts
import pkg from './package.json';

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    'notivue/nuxt',
    '@nuxtjs/i18n',
  ],

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    locales: [
      { code: 'en', iso: 'en-GB', file: 'en-GB.json', name: '🇬🇧 English' },
      {
        code: 'ar',
        iso: 'ar-IQ',
        file: 'ar-IQ.json',
        name: '🇮🇶 العربية (العراق)',
      },
      {
        code: 'nb',
        iso: 'nb-NO',
        file: 'nb-NO.json',
        name: '🇳🇴 Norsk (Bokmål)',
      },
      { code: 'nl', iso: 'nl-NL', file: 'nl-NL.json', name: '🇳🇱 Nederlands' },
      { code: 'de', iso: 'de-DE', file: 'de-DE.json', name: '🇩🇪 Deutsch' },
    ],
  },

  // NuxtHub removed for Netlify compatibility

  notivue: {
    position: 'top-center',
    limit: 3,
    notifications: { global: { duration: 3000 } },
  },

  css: ['notivue/notification.css', 'notivue/animations.css'],

  runtimeConfig: {
    supabase: {
      url: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
    public: {
      version: pkg.version,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/categories': { swr: 3600 },
    '/favorites': { swr: 600 },
  },

  nitro: {
    preset: 'netlify',
    prerender: { routes: ['/sitemap.xml', '/robots.txt'] },
  },

  compatibilityDate: '2024-08-03',
});
