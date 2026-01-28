// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // Disable SSR since this is a Firebase auth app (client-side only)
  ssr: false,
  modules: [
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
  ],
  icon: {
    // Icon configuration for @nuxt/icon
    // Use local server bundle mode for better performance
    serverBundle: "local",
    // Set preferred icon collections
    collections: ["heroicons", "mdi"],
    // Customize default size
    size: "24px",
    // Optimize icons in production
    clientBundle: {
      // Only include icons that are used
      scan: true,
      // Size limit for client bundle
      sizeLimitKb: 256,
    },
  },
  runtimeConfig: {
    // Private keys - only available server-side
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    // Public keys - exposed to the client
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    },
  },
});
