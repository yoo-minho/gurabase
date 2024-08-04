// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ["@nuxt/ui"],
  css: [
    'highlight.js/styles/github-dark.css'
  ]
})